from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # without DATABASE_URL and SECRET_KEY the server will not run
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # google login is optional, so the server can run without this
    GOOGLE_CLIENT_ID: str = ""

    class Config:
        env_file = ".env"

# Single instance — imported everywhere
settings = Settings()
