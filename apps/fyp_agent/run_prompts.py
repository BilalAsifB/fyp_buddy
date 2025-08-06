from langchain_core.prompts import ChatPromptTemplate
from src.agent.domain.prompts import (
    PROJECT_GENERATION_SYSTEM_PROMPT,
    PROJECT_GENERATION_USER_PROMPT,
    Prompt
)

prompt = ChatPromptTemplate.from_messages([
    ("system", PROJECT_GENERATION_SYSTEM_PROMPT),
    ("human", PROJECT_GENERATION_USER_PROMPT)
])

Prompt(
    prompt_identifier="project_generation",
    prompt=prompt,
    is_public=False,
    tags=[
        "generation",
        "qwen/qwen3-32b",
        "v1.3"
    ],
    description=(
        "Prompt to generate project ideas."
    )
)
