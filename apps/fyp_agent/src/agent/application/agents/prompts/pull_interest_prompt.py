from loguru import logger

from langchain.prompts import ChatPromptTemplate

from langsmith import Client
from langsmith.utils import LangSmithUserError

from agent.config import settings


def pull_interest_gen_prompt() -> ChatPromptTemplate:
    '''
    Pulls prompt from LangSmith.
    '''
    try:
        client = Client(api_key=settings.LANGSMITH_API_KEY)
        prompt = client.pull_prompt("interest_generation", include_model=True)

        logger.info("Prompt successfully pulled.")
    except LangSmithUserError as e:
        logger.error(f"Failed to pull prompt: {e}")
        raise

    return prompt
