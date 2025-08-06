from pydantic import BaseModel, Field

from .project_info import Project_info


class Projects_list(BaseModel):
    '''
    List of type Project_info model.
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
    all_projects: list[Project_info] = Field(
        description="List of project ideas and student data."
    )