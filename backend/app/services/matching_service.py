"""
Matching Service
File: backend/app/services/matching_service.py
"""

import time
import uuid
from typing import List, Optional
from loguru import logger
from datetime import datetime

from app.models.requests import ProfileRequest
from app.models.responses import MatchingResponse, MatchResponse, MetadataResponse
from app.models.errors import NoDataErrorResponse, NoMatchesErrorResponse

# Import your existing agent components
from src.agent.application.agents.graphs.build_find_match_graph import MatcherGraphRunner
from src.agent.domain.fyp_data import Fyp_data
from src.agent.domain.metadata import Metadata
from src.agent.infrastructure.mongo.service import MongoDBService
from src.agent.utils import generate_random_hex


class MatchingService:
    """Service for handling student matching logic"""
    
    def __init__(self):
        self.matcher = MatcherGraphRunner()
        logger.info("✅ Matching service initialized")
    
    def _convert_request_to_fyp_data(self, request: ProfileRequest) -> Fyp_data:
        """Convert API request to internal Fyp_data format"""
        
        # Generate unique ID for the query
        query_id = generate_random_hex(16)
        
        # Convert metadata
        metadata = Metadata(
            id=query_id,
            department=request.metadata.department,
            year=request.metadata.year,
            gpa=request.metadata.gpa,
            gender=request.metadata.gender.value,  # Get enum value
            skills=request.metadata.skills,
            email=request.metadata.email
        )
        
        # Create Fyp_data object
        fyp_data = Fyp_data(
            id=query_id,
            title=request.title or "",
            domain=request.domain,
            idea=request.idea,
            tech_stack=request.tech_stack,
            interests=request.interests,
            score=0.0,  # Will be set during matching
            metadata=metadata
        )
        
        return fyp_data
    
    def _convert_fyp_data_to_response(self, fyp_data: Fyp_data) -> MatchResponse:
        """Convert internal Fyp_data to API response format"""
        
        metadata_response = MetadataResponse(
            department=fyp_data.metadata.department,
            year=fyp_data.metadata.year,
            gpa=fyp_data.metadata.gpa,
            gender=fyp_data.metadata.gender,
            skills=fyp_data.metadata.skills,
            email=fyp_data.metadata.email
        )
        
        return MatchResponse(
            id=fyp_data.id,
            title=fyp_data.title,
            domain=fyp_data.domain,
            idea=fyp_data.idea,
            tech_stack=fyp_data.tech_stack,
            interests=fyp_data.interests,
            score=round(fyp_data.score, 2),  # Round to 2 decimal places
            metadata=metadata_response
        )
    
    async def check_data_availability(self) -> Optional[NoDataErrorResponse]:
        """Check if there's data available in the system"""
        try:
            with MongoDBService(
                model=Fyp_data,
                collection_name="std_profiles"
            ) as service:
                count = service.get_collection_count()
                
                if count == 0:
                    logger.warning("⚠️ No student profiles found in database")
                    return NoDataErrorResponse()
                
                logger.info(f"📊 Found {count} student profiles in database")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error checking data availability: {e}")
            raise
    
    async def find_matches(self, request: ProfileRequest) -> MatchingResponse:
        """Find matches for a student profile"""
        start_time = time.time()
        query_id = str(uuid.uuid4())[:8]
        
        logger.info(f"🔍 Starting match search [{query_id}] for domain: {request.domain}")
        
        try:
            # Check if data is available
            no_data_error = await self.check_data_availability()
            if no_data_error:
                processing_time = (time.time() - start_time) * 1000
                return MatchingResponse(
                    success=False,
                    message=no_data_error.message,
                    matches=[],
                    total_matches=0,
                    query_id=query_id,
                    processing_time_ms=round(processing_time, 2)
                )
            
            # Convert request to internal format
            fyp_query = self._convert_request_to_fyp_data(request)
            
            logger.info(f"🤖 Running matching algorithm [{query_id}]...")
            
            # Run the matching algorithm
            match_result = self.matcher.find_matches(fyp_query)
            
            # Extract matches from result
            matches = []
            if match_result.all_data:
                for fyp_data in match_result.all_data:
                    # Only include matches with score > 0
                    if fyp_data.score > 0:
                        match_response = self._convert_fyp_data_to_response(fyp_data)
                        matches.append(match_response)
                
                # Sort by score (highest first)
                matches.sort(key=lambda x: x.score, reverse=True)
            
            processing_time = (time.time() - start_time) * 1000
            
            if not matches:
                logger.warning(f"⚠️ No matches found [{query_id}]")
                return MatchingResponse(
                    success=False,
                    message="No suitable matches found for your profile.",
                    matches=[],
                    total_matches=0,
                    query_id=query_id,
                    processing_time_ms=round(processing_time, 2)
                )
            
            logger.info(f"✅ Found {len(matches)} matches [{query_id}] in {processing_time:.2f}ms")
            
            return MatchingResponse(
                success=True,
                message=f"Found {len(matches)} suitable matches for your profile.",
                matches=matches,
                total_matches=len(matches),
                query_id=query_id,
                processing_time_ms=round(processing_time, 2)
            )
            
        except Exception as e:
            processing_time = (time.time() - start_time) * 1000
            logger.error(f"❌ Error during matching [{query_id}]: {e}")
            raise


class HealthService:
    """Service for health checks"""
    
    def __init__(self):
        self.start_time = time.time()
    
    async def get_health_status(self) -> dict:
        """Get comprehensive health status"""
        services = {}
        
        # Check MongoDB
        try:
            with MongoDBService(
                model=Fyp_data,
                collection_name="std_profiles"
            ) as service:
                count = service.get_collection_count()
                services["mongodb"] = f"✅ Connected ({count} documents)"
        except Exception as e:
            services["mongodb"] = f"❌ Error: {str(e)[:100]}"
        
        # Check Groq API (basic connectivity)
        try:
            from src.agent.config import settings as agent_settings
            if agent_settings.GROQ_API_KEY:
                services["groq_api"] = "✅ API Key configured"
            else:
                services["groq_api"] = "❌ API Key missing"
        except Exception as e:
            services["groq_api"] = f"❌ Error: {str(e)[:100]}"
        
        # Check LangSmith
        try:
            from src.agent.config import settings as agent_settings
            if agent_settings.LANGSMITH_API_KEY:
                services["langsmith"] = "✅ Tracing configured"
            else:
                services["langsmith"] = "❌ Tracing not configured"
        except Exception as e:
            services["langsmith"] = f"❌ Error: {str(e)[:100]}"
        
        return services
    
    def get_uptime(self) -> float:
        """Get service uptime in seconds"""
        return time.time() - self.start_time
