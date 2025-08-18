from pydantic import BaseModel, Field

from .fyp_data import Fyp_data


class Gen_State(BaseModel):
    '''
    Generation state for project idea and interests.
    '''
    departments: list[str] = Field(
        description="The possible departments."
    )
    previous_ideas: list[str] = Field(
        description="List of existing project titles."
    )
    yos: list[int] = Field(
        description="The possible enrollment years."
    )
    all_data: list[Fyp_data] = Field(
        description="List of student data containing their project ideas/interests,"
        "and metadata."
    )
