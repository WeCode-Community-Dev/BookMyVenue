import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

# Determine base directory of the server folder
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    # App General Settings
    PROJECT_NAME: str = "Book my venue API"
    PROJECT_DESCRIPTION: str = "Backend API for Book my venue"
    API_V1_STR: str = "/api/v1"

    # Security Settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Storage Settings
    DATABASE_URL: str = "sqlite:///./app.db"
    REDIS_URL: str = ""

    # OTP Settings
    OTP_EXPIRE_SECONDS: int = 300
    OTP_LENGTH: int = 6

    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    """
    # Allowed origins
    BACKEND_CORS_ORIGINS = [
        "http://localhost",
        "http://localhost:3000",  # React or frontend running locally
        "http://localhost:5000",  # Flutter web URL
        "http://localhost:4200",  # Angular frontend
        "http://127.0.0.1:5500",  # Example: local HTML/JS testing
        # "https://yourdomain.com",  # Production frontend
        "*",  # (not recommended for production, allows all origins)
    ]
    """

    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str

    # Use SettingsConfigDict for Pydantic v2 settings loading configuration
    model_config = SettingsConfigDict(
        env_file=os.path.join(BASE_DIR, ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# Load application configurations
settings = Settings()
