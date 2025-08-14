"""
Rate Limiting Middleware
File: backend/app/api/middleware/rate_limiting.py
"""

import time
from datetime import datetime, timedelta
from typing import Dict, Optional
from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
from app.models.errors import ErrorResponse, ErrorType
from loguru import logger
import hashlib
import json


class InMemoryRateLimiter:
    """In-memory rate limiter for development/small deployments"""
    
    def __init__(self, max_calls_per_day: int):
        self.max_calls_per_day = max_calls_per_day
        self.calls: Dict[str, Dict] = {}
    
    def _get_user_key(self, request: Request) -> str:
        """Generate a unique key for the user"""
        # Use IP + User-Agent as identifier
        ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        
        # Create a hash of IP + User-Agent for privacy
        identifier = f"{ip}:{user_agent}"
        return hashlib.sha256(identifier.encode()).hexdigest()[:16]
    
    def _reset_if_new_day(self, user_key: str) -> None:
        """Reset counter if it's a new day"""
        now = datetime.utcnow()
        today = now.date()
        
        if user_key not in self.calls:
            self.calls[user_key] = {
                "count": 0,
                "date": today,
                "reset_time": datetime.combine(today + timedelta(days=1), datetime.min.time())
            }
        elif self.calls[user_key]["date"] != today:
            self.calls[user_key] = {
                "count": 0,
                "date": today,
                "reset_time": datetime.combine(today + timedelta(days=1), datetime.min.time())
            }
    
    def is_allowed(self, request: Request) -> tuple[bool, dict]:
        """Check if request is allowed and return status info"""
        user_key = self._get_user_key(request)
        self._reset_if_new_day(user_key)
        
        user_data = self.calls[user_key]
        calls_made = user_data["count"]
        
        status_info = {
            "calls_remaining": max(0, self.max_calls_per_day - calls_made),
            "calls_made": calls_made,
            "daily_limit": self.max_calls_per_day,
            "reset_time": user_data["reset_time"]
        }
        
        if calls_made >= self.max_calls_per_day:
            return False, status_info
        
        return True, status_info
    
    def increment(self, request: Request) -> None:
        """Increment the call count for the user"""
        user_key = self._get_user_key(request)
        self._reset_if_new_day(user_key)
        self.calls[user_key]["count"] += 1


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware"""
    
    def __init__(self, app, max_calls_per_day: int = None):
        super().__init__(app)
        self.max_calls_per_day = max_calls_per_day or settings.RATE_LIMIT_CALLS_PER_DAY
        self.limiter = InMemoryRateLimiter(self.max_calls_per_day)
        logger.info(f"🚦 Rate limiting enabled: {self.max_calls_per_day} calls per day")
    
    async def dispatch(self, request: Request, call_next):
        """Process the request with rate limiting"""
        
        # Skip rate limiting for health checks and docs
        if request.url.path in ["/", "/health", "/health/", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        # Skip for non-matching API endpoints
        if not request.url.path.startswith("/api/v1/matching"):
            return await call_next(request)
        
        # Check rate limit
        is_allowed, status_info = self.limiter.is_allowed(request)
        
        if not is_allowed:
            logger.warning(f"🚫 Rate limit exceeded for user. Calls made: {status_info['calls_made']}")
            
            error_response = ErrorResponse(
                error_type=ErrorType.RATE_LIMIT_ERROR,
                message=f"Daily API limit exceeded. You can make {self.max_calls_per_day} calls per day.",
                details=None
            )
            
            return Response(
                content=error_response.model_dump_json(),
                status_code=429,
                headers={
                    "Content-Type": "application/json",
                    "X-RateLimit-Limit": str(self.max_calls_per_day),
                    "X-RateLimit-Remaining": str(status_info["calls_remaining"]),
                    "X-RateLimit-Reset": str(int(status_info["reset_time"].timestamp())),
                }
            )
        
        # Process request
        response = await call_next(request)
        
        # Increment counter only for successful requests to matching endpoints
        if response.status_code < 500:  # Don't count server errors against user
            self.limiter.increment(request)
            
            # Add rate limit headers to response
            response.headers["X-RateLimit-Limit"] = str(self.max_calls_per_day)
            response.headers["X-RateLimit-Remaining"] = str(max(0, status_info["calls_remaining"] - 1))
            response.headers["X-RateLimit-Reset"] = str(int(status_info["reset_time"].timestamp()))
        
        return response
