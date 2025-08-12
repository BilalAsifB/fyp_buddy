from langchain_core.prompts import ChatPromptTemplate
from src.agent.domain.prompts import (
    CONNECTION_FINDING_SYSTEM_PROMPT,
    CONNECTION_FINDING_USER_PROMPT,
    Prompt
)

prompt = ChatPromptTemplate.from_messages([
    ("system", CONNECTION_FINDING_SYSTEM_PROMPT),
    ("human", CONNECTION_FINDING_USER_PROMPT)
])

Prompt(
    prompt_identifier="finding_connections",
    prompt=prompt,
    is_public=False,
    tags=[
        "find_connections",
        "llama-3.1-8b-instant",
        "v1.5"
    ],
    description=(
        "Prompt to connect similar student profiles."
    )
)
