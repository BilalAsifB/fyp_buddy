from typing import List
from pydantic import BaseModel, Field

from ..utils import generate_random_hex
from .metadata import Metadata


class Interest_info(BaseModel):
    '''
    Project information model that includes details about the project.
    '''
    id: str = Field(..., description="Student id.")
    interests: List[str] = Field(
        ...,
        description=(
            "Interests of the student, i.e types of projects "
            "they are interested in."
        )
    )
    metadata: Metadata = Field(..., description="Metadata of the student")
