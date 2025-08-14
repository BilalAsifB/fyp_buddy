"""
Logging Configuration
File: backend/app/core/logging.py
"""

import sys
from loguru import logger
from app.core.config import settings


def setup_logging():
    """Configure logging for the application"""
    
    # Remove default handler
    logger.remove()
    
    # Add console handler with custom format
    logger.add(
        sys.stdout,
        format=settings.LOG_FORMAT,
        level=settings.LOG_LEVEL,
        colorize=True,
        backtrace=True,
        diagnose=True
    )
    
    # Add file handler for production
    if settings.is_production:
        logger.add(
            "/app/logs/app.log",
            format=settings.LOG_FORMAT,
            level="INFO",
            rotation="1 day",
            retention="30 days",
            compression="gzip",
            backtrace=True,
            diagnose=True
        )
        
        # Add error log file
        logger.add(
            "/app/logs/error.log",
            format=settings.LOG_FORMAT,
            level="ERROR",
            rotation="1 day",
            retention="30 days",
            compression="gzip",
            backtrace=True,
            diagnose=True
        )
    
    # Configure langsmith logging
    if settings.LANGSMITH_TRACING.lower() == "true":
        import os
        os.environ["LANGCHAIN_TRACING_V2"] = "true"
        os.environ["LANGCHAIN_API_KEY"] = settings.LANGSMITH_API_KEY
        os.environ["LANGCHAIN_ENDPOINT"] = settings.LANGSMITH_ENDPOINT
        os.environ["LANGCHAIN_PROJECT"] = settings.LANGSMITH_PROJECT
        
        logger.info("✅ LangSmith tracing enabled")
    
    logger.info(f"🔧 Logging configured - Level: {settings.LOG_LEVEL}")
    
    # Test logging levels
    if settings.is_development:
        logger.debug("Debug logging enabled")
        logger.info("Info logging enabled")
        logger.warning("Warning logging enabled")
