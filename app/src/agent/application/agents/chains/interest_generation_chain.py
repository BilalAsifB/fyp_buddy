from langchain.output_parsers import PydanticOutputParser
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_groq import ChatGroq

from src.agent.application.agents.prompts.pull_interest_prompt import (
    pull_interest_gen_prompt,
)

from src.agent.domain.gen_state import Gen_State

from app.core.config import settings

from loguru import logger


def build_interest_generation_chain():
    logger.info("[Chain] Building interest generation chain...")

    parser = PydanticOutputParser(pydantic_object=Gen_State)
    format_instructions = parser.get_format_instructions()

    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model="qwen/qwen3-32b",
        temperature=0.7,
        reasoning_effort="none",
        reasoning_format="hidden",
        model_kwargs={
            "top_p": 0.9,
            "response_format": {"type": "json_object"}
        }
    )

    prompt = pull_interest_gen_prompt()

    chain = prompt.partial(
        format_instructions=format_instructions
    ) | llm | JsonOutputParser()

    return chain
