from functools import lru_cache
from typing import List

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_PLACEHOLDER_SECRET = "change-me-in-production"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore"
    )

    APP_NAME: str = "BookMyVenue"
    ENVIRONMENT: str = "development"
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    DATABASE_URL: str = "sqlite:///./bmv.db"

    JWT_SECRET: str = _PLACEHOLDER_SECRET
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    GOOGLE_CLIENT_ID: str = ""

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def _split_cors(cls, v):
        if isinstance(v, str):
            # Accept JSON list or comma-separated
            v = v.strip()
            if v.startswith("["):
                import json
                return json.loads(v)
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @model_validator(mode="after")
    def _enforce_secrets_in_production(self):
        if self.ENVIRONMENT != "development":
            if not self.JWT_SECRET or self.JWT_SECRET == _PLACEHOLDER_SECRET:
                raise ValueError(
                    "JWT_SECRET must be set to a strong random value in non-development "
                    "environments (ENVIRONMENT != 'development')."
                )
            if self.DATABASE_URL.startswith("sqlite"):
                raise ValueError(
                    "SQLite is not permitted outside development; set a non-sqlite DATABASE_URL."
                )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
