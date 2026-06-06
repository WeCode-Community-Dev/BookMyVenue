from fastapi import FastAPI, Depends
from database import get_db
from sqlalchemy.orm import Session

from models.user import User
from models.venue import Venue
from models.availability import Availability
from models.booking import Booking
from database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "okay"}

@app.get("/db-check")
def db_check(db:Session = Depends(get_db)):
    return {"status": f"{db}connected"}