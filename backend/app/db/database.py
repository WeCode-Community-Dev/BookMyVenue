from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings


# Creating the engine - the single connection to database
engine = create_engine(
    settings.DATABASE_URL,
)

# Session factory - creating individual sessions per request
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class - all our models will inherit from this
Base = declarative_base()