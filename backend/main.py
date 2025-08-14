"""
FastAPI Application Entry Point
File: backend/main.py
"""

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.core.config import settings
from app.core.logging import setup_logging
from app.api.routes import health, matching
from app.api.middleware.cors import setup_cors
from app.api.middleware.error_handler import setup_error_handlers
from app.api.middleware.rate_limiting import RateLimitMiddleware

from loguru import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting FYP Agent API...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    
    # Test database connection
    try:
        from src.agent.infrastructure.mongo.service import MongoDBService
        from src.agent.domain.fyp_data import Fyp_data
        
        with MongoDBService(
            model=Fyp_data,
            collection_name="std_profiles"
        ) as service:
            count = service.get_collection_count()
            logger.info(f"✅ MongoDB connected. Documents in collection: {count}")
            
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("🔌 Shutting down FYP Agent API...")


def create_application() -> FastAPI:
    """Create and configure FastAPI application"""
    
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="FYP Student Matching System API",
        version=settings.VERSION,
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan
    )
    
    # Setup CORS
    setup_cors(app)
    
    # Setup error handlers
    setup_error_handlers(app)
    
    # Add rate limiting middleware
    app.add_middleware(RateLimitMiddleware)
    
    # Include routers
    app.include_router(health.router, prefix="/health", tags=["health"])
    app.include_router(matching.router, prefix="/api/v1", tags=["matching"])
    
    @app.get("/")
    async def root():
        """Root endpoint"""
        return {
            "message": "FYP Agent API",
            "version": settings.VERSION,
            "docs": "/docs" if settings.DEBUG else "Documentation disabled in production"
        }
    
    return app


# Initialize logging
setup_logging()

# Create FastAPI app
app = create_application()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
