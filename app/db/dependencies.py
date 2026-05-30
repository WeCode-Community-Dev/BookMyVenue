# purpose is to create a database session for each request and automatically close it when the request is finished
from app.db.session import SessionLocal
 
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()