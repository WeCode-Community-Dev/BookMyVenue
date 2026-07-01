from functools import lru_cache
import os
from dotenv import load_dotenv
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()
database_url = os.getenv('DATABASE_URL') or ''

class Settings(BaseSettings):
    APP_NAME: str = "BookMyVenue"
    ENVIRONMENT: Literal["development", "staging", "production"] = "production"
    DEBUG: bool = True

    DATABASE_URL: str | None = database_url

    UPSTASH_REDIS_CELERY_URL: str = os.getenv("UPSTASH_REDIS_CELERY_URL") or ""
    CELERY_RESULT_BACKEND: str = f"db+{DATABASE_URL}"

    model_config = SettingsConfigDict(
        # Read from a local environment file if variables are not in env
        env_file=".env",
        # Ignore extra environment variables passed to the container
        extra="ignore",
        # Case-insensitive environment matching
        case_sensitive=False  # Changed to False for looser, safer cross-platform container deploys
    )

@lru_cache  # this decorator is used to cache the expensive function calls , should be used in the fuctions that retrns sam thing again and again , not the functions that generatees dynamic content.
def get_settings() -> Settings:
    return Settings()

# Instantiate for easy structural access across your app components
settings = get_settings()