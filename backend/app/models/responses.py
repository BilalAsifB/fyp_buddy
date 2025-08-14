"""
File: backend/app/models/responses.py
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class MetadataResponse(BaseModel):
    """Student metadata response"""
    department: str
    year: int
    gpa: float
    gender: str
    skills: List[str]
    email: str


class MatchResponse(BaseModel):
    """Individual match response"""
    id: str = Field(..., description="Student ID")
    title: str = Field(..., description="Project title")
    domain: str = Field(..., description="Project domain")
    idea: str = Field(..., description="Project idea")
    tech_stack: List[str] = Field(..., description="Technical stack")
    interests: List[str] = Field(..., description="Student interests")
    score: float = Field(..., ge=0.0, le=5.0, description="Match score")
    metadata: MetadataResponse = Field(..., description="Student metadata")


class MatchingResponse(BaseModel):
    """Main matching response"""
    success: bool = Field(..., description="Whether the request was successful")
    message: str = Field(..., description="Response message")
    matches: List[MatchResponse] = Field(..., description="List of matched students")
    total_matches: int = Field(..., description="Total number of matches found")
    query_id: str = Field(..., description="Query identifier for tracking")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Service status")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    version: str = Field(..., description="API version")
    services: Dict[str, str] = Field(..., description="Status of dependent services")
    uptime: float = Field(..., description="Uptime in seconds")


class RateLimitResponse(BaseModel):
    """Rate limit status response"""
    calls_remaining: int = Field(..., description="Remaining API calls for today")
    calls_made: int = Field(..., description="API calls made today")
    daily_limit: int = Field(..., description="Daily API call limit")
    reset_time: datetime = Field(..., description="When the limit resets")
