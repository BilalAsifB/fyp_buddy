"""
CORS Middleware
File: backend/app/api/middleware/cors.py
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from loguru import logger


def setup_cors(app: FastAPI) -> None:
    """Setup CORS middleware"""
    
    # Allow all origins in development, restrict in production
    if settings.is_development:
        allowed_origins = ["*"]
        logger.warning("🔓 CORS configured for development - allowing all origins")
    else:
        allowed_origins = settings.ALLOWED_ORIGINS
        logger.info(f"🔒 CORS configured for production - allowed origins: {allowed_origins}")
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
