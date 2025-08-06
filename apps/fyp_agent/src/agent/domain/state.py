from pydantic import BaseModel, Field
from typing import List

from .fyp_data import Fyp_data


class State(BaseModel):
    '''
    Langraph input state.
    '''
    all_data: List[Fyp_data] = Field(..., description="List fyp data")
    query: Fyp_data = Field(..., description="Query input.")
    done: bool = Field(..., description="Indicator of all data procssed.")
