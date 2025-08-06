from langchain.output_parsers import PydanticOutputParser
from langchain_core.output_parsers.json import JsonOutputParser
from langchain_groq import ChatGroq

from ...agents.prompts import pull_connection_finding_prompt

from ....domain.connection_llm_output import Connection_llm_output
from ....config import settings

from loguru import logger


def connection_finding_chain():
    logger.info("[Chain] Building connection finding chain...")

    parser = PydanticOutputParser(pydantic_object=Connection_llm_output)
    format_instructions = parser.get_format_instructions()

    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model="llama-3.1-8b-instant",
        temperature=0,
        model_kwargs={
            "top_p": 0.7,
            "response_format": {"type": "json_object"}
        }
    )

    prompt = pull_connection_finding_prompt()

    chain = prompt.partial(
        format_instructions=format_instructions
    ) | llm | JsonOutputParser()

    return chain
