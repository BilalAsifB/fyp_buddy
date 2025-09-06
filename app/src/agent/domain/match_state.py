from pydantic import BaseModel, Field, ConfigDict
from typing import List

from langchain.schema.runnable import Runnable

from .fyp_data import Fyp_data

from typing import Any, Optional

class Match_State(BaseModel):
    '''
    Langraph input state
    '''
    model_config = ConfigDict(arbitrary_types_allowed=True)

    all_data: List[Fyp_data] = Field(..., description="List fyp data")
    query: Fyp_data = Field(..., description="Query input.")
    done: bool = Field(..., description="Indicator of all data procssed.")
    offset: int = Field(0, description="Offset for pagination.")
    limit: int = Field(20, description="Limit for pagination.")
    results: dict = Field(
        description="Dictionary of results with student id as key and score as value."
    ) 
    # chain: Runnable = Field(..., description="The connection finding chain.")
    chain: Optional[Any] = Field(default=None, exclude=True, description="The connection finding chain.")
