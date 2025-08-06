from loguru import logger
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from pathlib import Path


class Settings(BaseSettings):
    """
    A Pydantic-based settings class for managing application configurations.
    """

    # --- Pydantic Settings ---
    model_config: SettingsConfigDict = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8"
    )

    # --- Langsmith/LangChain Configuration ---
    LANGSMITH_API_KEY: str = Field(
        description="API key for LangSmith services."
    )
    LANGSMITH_TRACING: str = Field(
        description="Allowing tracing."
    )
    LANGSMITH_ENDPOINT: str = Field(
        description="Langsmith endpoint."
    )
    LANGSMITH_PROJECT: str = Field(
        description="Project name."
    )

    # --- Groq Configuration ---
    GROQ_API_KEY: str = Field(
        description="API key for Groq services."
    )

    # --- Hugging Face Configuration ---
    # HUGGINGFACE_ACCESS_TOKEN: Optional[str] = Field(
    #     default=None, description="Access token for Hugging Face API authentication."
    # )
    # HUGGINGFACE_DEDICATED_ENDPOINT: Optional[str] = Field(
    #     default=None,
    #     description="Dedicated endpoint URL for real-time inference. "
    #     "If provided, we will use the dedicated endpoint instead of OpenAI. "
    #     "For example, https://um18v2aeit3f6g1b.eu-west-1.aws.endpoints.huggingface.cloud/v1/, "
    #     "with /v1 after the endpoint URL.",
    # )

    # --- MongoDB Atlas Configuration ---
    MONGODB_DATABASE_NAME: str = Field(
        description="Name of the MongoDB database.",
    )
    MONGODB_URI: str = Field(
        description="Connection URI for the local MongoDB Atlas instance.",
    )


# Initialize settings on import, fail early if anything is missing
try:
    settings = Settings()
except Exception as e:
    logger.error(f"Failed to load configuration: {e}")
    raise SystemExit(e)
