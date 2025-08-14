from typing import List
from pydantic import BaseModel, Field
 
from .metadata import Metadata


class Project_info(BaseModel):
    '''
    Project information model that includes details about the project.
    '''
    id: str = Field(..., description="Student id.")
    title: str = Field(..., description="A name for the project that aligns with the idea")
    domain: str = Field(..., description="Domain of the project")
    idea: str = Field(..., description="Project idea")
    tech_stack: List[str] = Field(..., description="Technical stack required for the project")
    metadata: Metadata = Field(..., description="Metadata of the student")
