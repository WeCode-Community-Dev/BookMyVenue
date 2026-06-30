
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from src.bookmyvenue.core.config import settings
#Just a common base class
class Base(DeclarativeBase):
    pass

DATABASE_URL = settings.DATABASE_URL or ''
engine = create_engine(DATABASE_URL)
session = sessionmaker(autocommit = False, autoflush=True, bind=engine)