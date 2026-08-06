from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    # Must match Django backend SECRET_KEY so login tokens validate here.
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    # Backend internal API (service-to-service rating sync).
    BACKEND_BASE_URL: str = "http://backend:8000"
    INTERNAL_API_KEY: str = ""
    BACKEND_HTTP_TIMEOUT: float = 5.0

    # Comma-separated browser origins allowed to call this API.
    CORS_ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    class Config:
        env_file = ".env"


settings = Settings()
