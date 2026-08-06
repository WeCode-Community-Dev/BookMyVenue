from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    DATABASE_URL: str
    # Must match Django backend SECRET_KEY so login tokens validate here.
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"


settings = Settings()
