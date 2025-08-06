from langchain.output_parsers import PydanticOutputParser
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_groq import ChatGroq

from agent.application.agents.prompts.pull_proj_prompts import (
    pull_proj_gen_prompt
)
from agent.domain.gen_state import Gen_State
from agent.config import settings

from loguru import logger


def build_project_generation_chain():
    logger.info("[Chain] Building project generation chain...")

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

    prompt = pull_proj_gen_prompt()
 
    chain = prompt.partial(
        format_instructions=format_instructions
    ) | llm | JsonOutputParser()

    return chain
