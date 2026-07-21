from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # without DATABASE_URL and SECRET_KEY the server will not run
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    # google login is optional, so the server can run without this
    GOOGLE_CLIENT_ID: str = ""
    # razorpay is optional until real gateway integration is wired up
    RAZORPAY_API_KEY: str = ""
    RAZORPAY_API_SECRET: str = ""

    class Config:
        env_file = ".env"

# Single instance — imported everywhere
settings = Settings()
