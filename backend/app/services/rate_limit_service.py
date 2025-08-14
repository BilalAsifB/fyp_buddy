"""
Rate Limit Service
File: backend/app/services/rate_limit_service.py
"""

from datetime import datetime
from typing import Dict
from app.models.responses import RateLimitResponse
from app.core.config import settings


class RateLimitService:
    """Service for rate limit information"""
    
    @staticmethod
    def get_rate_limit_info(calls_made: int) -> RateLimitResponse:
        """Get rate limit information for response"""
        
        # Calculate reset time (next day at midnight UTC)
        now = datetime.utcnow()
        tomorrow = now.replace(hour=0, minute=0, second=0, microsecond=0)
        tomorrow = tomorrow.replace(day=tomorrow.day + 1)
        
        return RateLimitResponse(
            calls_remaining=max(0, settings.RATE_LIMIT_CALLS_PER_DAY - calls_made),
            calls_made=calls_made,
            daily_limit=settings.RATE_LIMIT_CALLS_PER_DAY,
            reset_time=tomorrow
        )
