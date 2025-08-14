"""
Health Check Routes
File: backend/app/api/routes/health.py
"""

from fastapi import APIRouter, Depends
from app.models.responses import HealthResponse
from app.services.matching_service import HealthService
from app.core.config import settings
from loguru import logger

router = APIRouter()
health_service = HealthService()


@router.get("/", response_model=HealthResponse)
async def health_check():
    """Basic health check endpoint"""
    
    logger.debug("Health check requested")
    
    # Get service status
    services = await health_service.get_health_status()
    uptime = health_service.get_uptime()
    
    # Determine overall status
    all_healthy = all("✅" in status for status in services.values())
    overall_status = "healthy" if all_healthy else "degraded"
    
    return HealthResponse(
        status=overall_status,
        version=settings.VERSION,
        services=services,
        uptime=round(uptime, 2)
    )


@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check with more information"""
    
    services = await health_service.get_health_status()
    uptime = health_service.get_uptime()
    
    return {
        "status": "healthy" if all("✅" in status for status in services.values()) else "degraded",
        "timestamp": health_service.start_time,
        "uptime_seconds": round(uptime, 2),
        "uptime_formatted": f"{uptime//3600:.0f}h {(uptime%3600)//60:.0f}m {uptime%60:.0f}s",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "services": services,
        "configuration": {
            "rate_limit_per_day": settings.RATE_LIMIT_CALLS_PER_DAY,
            "debug_mode": settings.DEBUG,
            "langsmith_tracing": settings.LANGSMITH_TRACING
        }
    }
