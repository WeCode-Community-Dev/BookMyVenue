# Create SQL Alchemy database engine for production database connection
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import Generator
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Config session local factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class for models
Base = declarative_base()


def get_db() -> Generator:
    """
    Dependency generator yielding db session and cleaning it up after requests.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
