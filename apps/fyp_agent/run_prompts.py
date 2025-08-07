from langchain_core.prompts import ChatPromptTemplate
from src.agent.domain.prompts import (
    INTEREST_GENERATION_SYSTEM_PROMPT,
    INTEREST_GENERATION_USER_PROMPT,
    Prompt
)

prompt = ChatPromptTemplate.from_messages([
    ("system", INTEREST_GENERATION_SYSTEM_PROMPT),
    ("human", INTEREST_GENERATION_USER_PROMPT)
])

Prompt(
    prompt_identifier="interest_generation",
    prompt=prompt,
    is_public=False,
    tags=[
        "generation",
        "qwen/qwen3-32b",
        "v1.5"
    ],
    description=(
        "Prompt to generate synthetic student interests."
    )
)
