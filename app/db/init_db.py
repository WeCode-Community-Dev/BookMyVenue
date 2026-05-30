# initialize all the tables and this file is imported in the main file 
from app.db.base import Base
from app.db.session import engine

# Import all models
from app.modules.users.models import User


def init_db():
    Base.metadata.create_all(bind=engine)