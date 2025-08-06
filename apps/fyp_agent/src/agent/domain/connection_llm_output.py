from pydantic import BaseModel, Field
from typing import List


class Connection_llm_output(BaseModel):
    '''
    Class of llm invokation output.
    '''
    id: List[str] = Field(..., description="Student id.")
    score: List[float] = Field(..., description="Score recieved by the LLM.")
