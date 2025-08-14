"""
Matching Routes
File: backend/app/api/routes/matching.py
"""

from fastapi import APIRouter, HTTPException, Request, Header
from typing import Optional
import time
import uuid
from loguru import logger

from app.models.requests import ProfileRequest
from app.models.responses import MatchingResponse, RateLimitResponse
from app.models.errors import NoDataErrorResponse, NoMatchesErrorResponse
from app.services.matching_service import MatchingService
from app.services.rate_limit_service import RateLimitService

router = APIRouter()
matching_service = MatchingService()
rate_limit_service = RateLimitService()


@router.post("/matching/find", response_model=MatchingResponse)
async def find_matches(
    request: ProfileRequest,
    http_request: Request,
    user_agent: Optional[str] = Header(None)
):
    """
    Find matching students for a given profile
    
    This endpoint uses AI to find students with similar interests, complementary skills,
    and compatible project ideas for Final Year Project collaboration.
    
    **Rate Limit**: 5 calls per day per user
    **Processing Time**: 15-60 seconds depending on database size
    """
    
    request_id = str(uuid.uuid4())[:8]
    start_time = time.time()
    
    # Log request details (without sensitive info)
    logger.info(f"🔍 Match request [{request_id}] - Domain: {request.domain}")
    logger.debug(f"Request details [{request_id}]: Tech stack: {len(request.tech_stack)} items, Interests: {len(request.interests)} items")
    
    try:
        # Find matches
        result = await matching_service.find_matches(request)
        
        # Update query ID and processing time
        result.query_id = request_id
        result.processing_time_ms = round((time.time() - start_time) * 1000, 2)
        
        # Log result
        if result.success:
            logger.info(f"✅ Match request [{request_id}] completed - Found: {result.total_matches} matches")
        else:
            logger.warning(f"⚠️ Match request [{request_id}] completed - No matches found")
        
        return result
        
    except Exception as e:
        processing_time = (time.time() - start_time) * 1000
        logger.error(f"❌ Match request [{request_id}] failed: {e}")
        
        # Return error response in consistent format
        return MatchingResponse(
            success=False,
            message="An error occurred while processing your request. Please try again later.",
            matches=[],
            total_matches=0,
            query_id=request_id,
            processing_time_ms=round(processing_time, 2)
        )


@router.get("/matching/rate-limit", response_model=RateLimitResponse)
async def get_rate_limit_status(request: Request):
    """
    Get current rate limit status for the user
    
    Shows how many API calls the user has made today and how many remain.
    """
    
    # This is a simplified version - in production you'd get actual usage from middleware
    # For now, return default values
    return rate_limit_service.get_rate_limit_info(calls_made=0)


@router.post("/matching/validate")
async def validate_profile(request: ProfileRequest):
    """
    Validate a profile request without performing matching
    
    Useful for frontend validation before submitting the actual matching request.
    This endpoint doesn't count against rate limits.
    """
    
    logger.debug("Profile validation requested")
    
    # If we reach here, Pydantic validation has already passed
    return {
        "valid": True,
        "message": "Profile validation successful",
        "profile_summary": {
            "domain": request.domain,
            "tech_stack_count": len(request.tech_stack),
            "interests_count": len(request.interests),
            "idea_length": len(request.idea),
            "department": request.metadata.department,
            "year": request.metadata.year
        }
    }


@router.get("/matching/stats")
async def get_matching_stats():
    """
    Get general statistics about the matching system
    
    Returns information about total profiles, domains, etc. without exposing sensitive data.
    """
    
    try:
        # Check data availability
        no_data_error = await matching_service.check_data_availability()
        
        if no_data_error:
            return {
                "total_profiles": 0,
                "status": "No data available",
                "message": no_data_error.message
            }
        
        # Get basic stats
        from src.agent.infrastructure.mongo.service import MongoDBService
        from src.agent.domain.fyp_data import Fyp_data
        
        with MongoDBService(model=Fyp_data, collection_name="std_profiles") as service:
            total_profiles = service.get_collection_count()
            
            # Get some sample data for domain analysis
            sample_data = service.fetch_documents(limit=100, offset=0)
            
            domains = set()
            departments = set()
            avg_tech_stack_size = 0
            
            if sample_data:
                for profile in sample_data:
                    domains.add(profile.domain)
                    departments.add(profile.metadata.department)
                
                avg_tech_stack_size = sum(len(profile.tech_stack) for profile in sample_data) / len(sample_data)
        
        return {
            "total_profiles": total_profiles,
            "unique_domains": len(domains),
            "unique_departments": len(departments),
            "avg_tech_stack_size": round(avg_tech_stack_size, 1),
            "status": "Data available",
            "sample_domains": list(domains)[:10] if domains else [],
            "sample_departments": list(departments) if departments else []
        }
        
    except Exception as e:
        logger.error(f"Error getting matching stats: {e}")
        return {
            "error": "Unable to retrieve statistics",
            "message": "Please try again later"
        }
