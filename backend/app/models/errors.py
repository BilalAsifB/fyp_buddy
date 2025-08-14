"""
File: backend/app/models/errors.py
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum


class ErrorType(str, Enum):
    """Error type enumeration"""
    VALIDATION_ERROR = "validation_error"
    DATABASE_ERROR = "database_error"
    EXTERNAL_API_ERROR = "external_api_error"
    RATE_LIMIT_ERROR = "rate_limit_error"
    NOT_FOUND_ERROR = "not_found_error"
    INTERNAL_ERROR = "internal_error"


class ValidationErrorDetail(BaseModel):
    """Validation error detail"""
    field: str = Field(..., description="Field that failed validation")
    message: str = Field(..., description="Validation error message")
    value: Any = Field(..., description="Invalid value")


class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = Field(default=False, description="Always false for errors")
    error_type: ErrorType = Field(..., description="Type of error")
    message: str = Field(..., description="Error message")
    details: Optional[List[ValidationErrorDetail]] = Field(
        default=None, 
        description="Detailed error information"
    )
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = Field(default=None, description="Request identifier")
    
    class Config:
        """Pydantic configuration"""
        use_enum_values = True


class NoDataErrorResponse(BaseModel):
    """Response when no data is available"""
    success: bool = Field(default=False)
    message: str = Field(default="No student profiles found in the system. Please come back later when more data is available.")
    suggestion: str = Field(default="Try again later or contact support if this persists.")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class NoMatchesErrorResponse(BaseModel):
    """Response when no matches are found"""
    success: bool = Field(default=False)
    message: str = Field(default="No suitable matches found for your profile.")
    suggestion: str = Field(default="Try broadening your interests or tech stack, or come back later as new profiles are added regularly.")
    total_profiles_searched: int = Field(..., description="Total profiles searched")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
