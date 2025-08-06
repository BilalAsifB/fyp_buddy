from pydantic import BaseModel, Field
from typing import List

from .metadata import Metadata


class Fyp_data(BaseModel):
    '''
    Pydantic class of fyp data.
    '''
    id: str = Field(..., description="Student id.")
    title: str = Field(
        ..., 
        description="A name for the project that aligns with the idea"
    )
    domain: str = Field(..., description="Domain of the project")
    idea: str = Field(..., description="Project idea")
    tech_stack: List[str] = Field(
        description="Technical stack required for the project"
    )
    interests: List[str] = Field(
        description=(
            "Interests of the student, i.e types of projects "
            "they are interested in."
        )
    )
    score: float = Field(description="Score given by the LLM.")
    metadata: Metadata = Field(..., description="Metadata of the student")
