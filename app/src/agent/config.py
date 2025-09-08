from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from loguru import logger


class Settings(BaseSettings):
    """Application settings with environment variable support"""

    # --- Pydantic Settings ---
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env") if (Path(__file__).resolve().parents[2] / ".env").exists() else None,
        env_file_encoding="utf-8",
        case_sensitive=False,  # Allow case-insensitive env var names
        extra="ignore"         # Ignore unknown variables instead of failing
    )

    # --- Langsmith/LangChain Configuration ---
    LANGSMITH_API_KEY: str = Field(
        description="API key for LangSmith services", 
        alias="langsmith_api_key"
    )
    LANGSMITH_TRACING: str = Field(
        default="true",
        description="Enable tracing",
        alias="langsmith_tracing"
    )
    LANGSMITH_ENDPOINT: str = Field(
        default="https://api.smith.langchain.com",
        description="Langsmith endpoint",
        alias="langsmith_endpoint"
    )
    LANGSMITH_PROJECT: str = Field(
        default="fyp-agent-api",
        description="Project name for tracing",
        alias="langsmith_project"
    )

    # --- Groq Configuration ---
    GROQ_API_KEY: str = Field(
        description="API key for Groq services", 
        alias="groq_api_key"
    )

    # --- MongoDB Atlas Configuration ---
    MONGODB_DATABASE_NAME: str = Field(
        default="fyp_buddy",
        description="Name of the MongoDB database",
        alias="mongodb_database_name"
    )
    MONGODB_URI: str = Field(
        default="mongodb://localhost:27017/fyp_buddy",
        description="Connection URI for MongoDB Atlas", 
        alias="mongodb_uri"
    )

    # --- Redis Configuration ---
    REDIS_HOST: str = Field(
        default="localhost",
        description="Redis host for background job queue",
        alias="redis_host"
    )
    REDIS_PORT: int = Field(
        default=6379,
        description="Redis port for background job queue",
        alias="redis_port"
    )

    REDIS_PASSWORD: str | None = Field(default=None, alias="redis_password")
    
    REDIS_SSL: bool = Field(default=False, alias="redis_ssl")

    # --- CORS Configuration ---
    CORS_ORIGINS: str = Field(
        default="*",
        description="Comma-separated list of allowed origins for CORS",
        alias="cors_origins"
    )

# Initialize settings
try:
    settings = Settings()
    logger.info("Configuration loaded successfully")
except Exception as e:
    logger.error(f"Failed to load configuration: {e}")
    raise SystemExit(1)
