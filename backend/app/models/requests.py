"""
API Models
File: backend/app/models/requests.py
"""

from pydantic import BaseModel, Field, validator, EmailStr
from typing import List, Optional
from enum import Enum


class GenderEnum(str, Enum):
    """Gender enumeration"""
    MALE = "Male"
    FEMALE = "Female"


class MetadataRequest(BaseModel):
    """Student metadata for API requests"""
    department: str = Field(..., min_length=2, max_length=100, description="Department of the student")
    year: int = Field(..., ge=19, le=25, description="Year of enrollment (e.g., 22 for 2022)")
    gpa: float = Field(..., ge=2.0, le=4.0, description="GPA of the student")
    gender: GenderEnum = Field(..., description="Gender of the student")
    skills: List[str] = Field(
        ..., 
        min_items=1, 
        max_items=20,
        description="List of technical skills"
    )
    email: EmailStr = Field(..., description="Student email address")
    
    @validator('skills')
    def validate_skills(cls, v):
        """Validate skills list"""
        if not v:
            raise ValueError("At least one skill is required")
        
        # Remove empty strings and duplicates
        skills = list(set([skill.strip() for skill in v if skill.strip()]))
        
        if not skills:
            raise ValueError("At least one valid skill is required")
            
        return skills[:20]  # Limit to 20 skills


class ProfileRequest(BaseModel):
    """Student profile request for finding matches"""
    title: str = Field(
        default="",
        max_length=200,
        description="Project title (optional)"
    )
    domain: str = Field(
        ..., 
        min_length=3, 
        max_length=100,
        description="Project domain (e.g., 'AI and Machine Learning')"
    )
    idea: str = Field(
        ..., 
        min_length=50, 
        max_length=1000,
        description="Detailed project idea (50-1000 characters)"
    )
    tech_stack: List[str] = Field(
        ..., 
        min_items=1, 
        max_items=25,
        description="Technical stack required for the project"
    )
    interests: List[str] = Field(
        default_factory=list,
        max_items=20,
        description="Student interests (optional)"
    )
    metadata: MetadataRequest = Field(..., description="Student metadata")
    
    @validator('tech_stack')
    def validate_tech_stack(cls, v):
        """Validate tech stack"""
        if not v:
            raise ValueError("At least one technology is required")
        
        # Remove empty strings and duplicates
        tech_stack = list(set([tech.strip() for tech in v if tech.strip()]))
        
        if not tech_stack:
            raise ValueError("At least one valid technology is required")
            
        return tech_stack[:25]  # Limit to 25 technologies
    
    @validator('interests')
    def validate_interests(cls, v):
        """Validate interests list"""
        # Remove empty strings and duplicates
        interests = list(set([interest.strip() for interest in v if interest.strip()]))
        return interests[:20]  # Limit to 20 interests
    
    @validator('idea')
    def validate_idea(cls, v):
        """Validate project idea"""
        v = v.strip()
        if len(v) < 50:
            raise ValueError("Project idea must be at least 50 characters")
        if len(v) > 1000:
            raise ValueError("Project idea must be at most 1000 characters")
        return v
