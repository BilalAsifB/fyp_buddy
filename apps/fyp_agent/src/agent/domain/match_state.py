from pydantic import BaseModel, Field
from typing import List

from .fyp_data import Fyp_data
from .connection_llm_output import Connection_llm_output

class Match_State(BaseModel):
    '''
    Langraph input state.s
    '''
    all_data: List[Fyp_data] = Field(..., description="List fyp data")
    query: Fyp_data = Field(..., description="Query input.")
    done: bool = Field(..., description="Indicator of all data procssed.")
    offset: int = Field(0, description="Offset for pagination.")
    limit: int = Field(20, description="Limit for pagination.")
    results: List[Connection_llm_output] = Field(
        description="List of results after processing."
    )
