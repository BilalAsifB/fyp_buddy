from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from typing import List, Optional, Union
import secrets
from urllib.parse import urlparse
import os


class Settings(BaseSettings):
    """Application settings with environment variable support"""

    # --- Pydantic Settings ---
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env") if (Path(__file__).resolve().parents[2] / ".env").exists() else None,
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
        description="Allowed CORS origins (list or comma-separated string)"
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
    LANGSMITH_API_KEY: str = Field(
        default="dummy-key", 
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
        default="dummy-key",
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
    def parse_origins_from_env(cls, v):
        """Parse ALLOWED_ORIGINS from environment variable."""
        if isinstance(v, str):
            if v == "*":
                return ["*"]
            # Split comma-separated string
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            return v
        else:
            return ["http://localhost:3000"]

    @field_validator("ALLOWED_ORIGINS", mode="after")
    @classmethod
    def validate_allowed_origins(cls, v: List[str]) -> List[str]:
        """Validate ALLOWED_ORIGINS list."""
        validated_origins = []
        for origin in v:
            if origin == "*":
                validated_origins.append(origin)
            else:
                try:
                    result = urlparse(origin)
                    if result.scheme and result.netloc:
                        validated_origins.append(origin)
                    else:
                        print(f"⚠️  Skipping invalid origin: {origin}")
                except Exception as e:
                    print(f"⚠️  Error parsing origin {origin}: {e}")
        
        return validated_origins if validated_origins else ["http://localhost:3000"]

    @property
    def parsed_allowed_origins(self) -> List[str]:
        """Get ALLOWED_ORIGINS as a list for use in CORS middleware."""
        return self.ALLOWED_ORIGINS

    # --- Helper properties ---
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.ENVIRONMENT == "production"

    @property
    def is_development(self) -> bool:
        """Check if running in development"""
        return self.ENVIRONMENT == "development"


# Check if .env file exists (optional for Docker)
env_file = Path(__file__).resolve().parents[2] / ".env"
if not env_file.exists():
    print(f"ℹ️  .env file not found at {env_file} - using environment variables from container")

# Initialize settings
try:
    settings = Settings()
    print(f"✅ Configuration loaded successfully")
    print(f"📊 Environment: {settings.ENVIRONMENT}")
    print(f"🔧 Debug mode: {settings.DEBUG}")
except Exception as e:
    print(f"❌ Configuration validation error: {e}")
    raise SystemExit(1)