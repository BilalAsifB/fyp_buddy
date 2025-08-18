from pydantic import BaseModel, Field


class Metadata(BaseModel):
    '''
    Metadata of the student involved in the project.
    '''
    id: str = Field(..., description="Student id.")
    department: str = Field(..., description="Department of the student")
    year: int = Field(..., description="Year of study of the student")
    gpa: float = Field(..., description="GPA of the student")
    gender: str = Field(..., description="Gender of the student")
    skills: list[str] = Field(
        ...,
        description="List of technical skills of the student"
    )
    email: str = Field(..., description="Student email.")
