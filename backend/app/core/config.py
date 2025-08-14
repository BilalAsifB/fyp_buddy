from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from typing import List, Optional
import secrets
from urllib.parse import urlparse
import os


class Settings(BaseSettings):
    """Application settings with environment variable support"""

    # --- Pydantic Settings ---
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,  # Allow case-insensitive env var names
        extra="ignore"         # Ignore unknown variables instead of failing
    )

    # --- Application Configuration ---
    PROJECT_NAME: str = Field(default="FYP Agent API", description="Project name", alias="project_name")
    VERSION: str = Field(default="1.0.0", description="API version", alias="version")
    ENVIRONMENT: str = Field(default="development", description="Environment", alias="environment")
    DEBUG: bool = Field(default=False, description="Debug mode", alias="debug")

    # --- Server Configuration ---
    HOST: str = Field(default="0.0.0.0", description="Server host", alias="host")
    PORT: int = Field(default=8000, description="Server port", alias="port")

    # --- Security Configuration ---
    SECRET_KEY: str = Field(
        default_factory=lambda: secrets.token_urlsafe(32),
        description="Secret key for security. Must be set explicitly in production for consistency.",
        alias="secret_key"
    )

    # --- CORS Configuration ---
    ALLOWED_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001"],
        description="Allowed CORS origins",
        alias="allowed_origins"
    )

    # --- Rate Limiting Configuration ---
    RATE_LIMIT_CALLS_PER_DAY: int = Field(
        default=5,
        description="Maximum API calls per user per day",
        alias="rate_limit_calls_per_day"
    )
    RATE_LIMIT_REDIS_URL: Optional[str] = Field(
        default=None,
        description="Redis URL for rate limiting (if None, uses in-memory storage)",
        alias="rate_limit_redis_url"
    )

    # --- Langsmith/LangChain Configuration ---
    LANGSMITH_API_KEY: str = Field(description="API key for LangSmith services", alias="langsmith_api_key")
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
    GROQ_API_KEY: str = Field(description="API key for Groq services", alias="groq_api_key")

    # --- MongoDB Atlas Configuration ---
    MONGODB_DATABASE_NAME: str = Field(
        default="fyp_buddy",
        description="Name of the MongoDB database",
        alias="mongodb_database_name"
    )
    MONGODB_URI: str = Field(description="Connection URI for MongoDB Atlas", alias="mongodb_uri")

    # --- Logging Configuration ---
    # Note: LOG_FORMAT assumes a logging library like `loguru` or `rich` that supports colored output
    LOG_LEVEL: str = Field(default="INFO", description="Logging level", alias="log_level")
    LOG_FORMAT: str = Field(
        default="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        description="Log format for libraries like loguru or rich",
        alias="log_format"
    )

    # --- Validators ---
    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        """Validate environment values"""
        allowed = ["development", "staging", "production"]
        if v.lower() not in allowed:
            raise ValueError(f"Environment must be one of {allowed}")
        return v.lower()

    @field_validator("LOG_LEVEL")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        """Validate log level"""
        allowed = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in allowed:
            raise ValueError(f"Log level must be one of {allowed}")
        return v.upper()

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def split_origins(cls, v):
        """
        Allow ALLOWED_ORIGINS in .env to be a comma-separated string.
        Example: "http://localhost:3000,http://localhost:3001"
        """
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def validate_origins(cls, v: List[str]) -> List[str]:
        """Validate that ALLOWED_ORIGINS are valid URLs."""
        for origin in v:
            try:
                result = urlparse(origin)
                if not all([result.scheme, result.netloc]):
                    raise ValueError(f"Invalid URL for origin: {origin}")
            except ValueError:
                raise ValueError(f"Invalid URL for origin: {origin}")
        return v

    # --- Helper properties ---
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.ENVIRONMENT == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development"""
        return self.ENVIRONMENT == "development"

# Validate .env file existence
env_file = Path(__file__).resolve().parents[2] / ".env"
if not env_file.exists():
    print(f"❌ .env file not found at {env_file}")
    raise FileNotFoundError(f".env file not found at {env_file}")

# Debug environment variables
print("Environment variables:", {
    k: v for k, v in os.environ.items()
    if k.lower() in [
        "project_name", "version", "environment", "debug", "host", "port", "secret_key",
        "allowed_origins", "rate_limit_calls_per_day", "rate_limit_redis_url",
        "langsmith_api_key", "langsmith_tracing", "langsmith_endpoint", "langsmith_project",
        "groq_api_key", "mongodb_database_name", "mongodb_uri", "log_level", "log_format"
    ]
})

# Initialize settings
try:
    settings = Settings()
except pydantic.ValidationError as e:
    print(f"❌ Configuration validation error: {e}")
    raise SystemExit(1)
except FileNotFoundError as e:
    print(f"❌ .env file error: {e}")
    raise SystemExit(1)
except Exception as e:
    print(f"❌ Unexpected error loading configuration: {e}")
    raise SystemExit(1)
