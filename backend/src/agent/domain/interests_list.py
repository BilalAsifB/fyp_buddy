from pydantic import BaseModel, Field

from .interest_info import Interest_info


class Interests_list(BaseModel):
    '''
    List of type Interest)info model.
    '''
    departments: list[str] = Field(
        description="The possible departments."
    )
    yos: list[int] = Field(
        description="The possible enrollment years."
    )
    all_interests: list[Interest_info] = Field(
        description="List of interests and student data."
    )
