from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    ENVIRONMENT: str = Field(default="development", description="Environment: development or production")
    
    # Database Configuration
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://postgres:1236@localhost:5432/bookmyvenue_db",
        description="The PostgreSQL database connection string",
    )

    # Redis Configuration
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0", description="The Redis connection string"
    )

    # RabbitMQ Configuration
    RABBITMQ_URL: str = Field(
        default="amqp://guest:guest@localhost/", description="The RabbitMQ connection string"
    )

    # Auth Configuration
    SECRET_KEY: str = Field(default="super_secret_temporary_key_for_mvp_only")
    REFRESH_SECRET_KEY: str = Field(default="super_secret_refresh_key_for_mvp_only")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=15)
    REFRESH_TOKEN_EXPIRE_MINUTES: int = Field(default=10080)  # 7 days

    # SMTP Configuration (Phase 2)
    SMTP_HOST: str = Field(default="smtp.gmail.com")
    SMTP_PORT: int = Field(default=587)
    SMTP_USER: str = Field(default="test@bookmyvenue.com")
    SMTP_PASSWORD: str = Field(default="password123")
    SMTP_TLS: bool = Field(default=True)

    # Use strict configuration mode
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore", strict=True
    )


settings = Settings()
