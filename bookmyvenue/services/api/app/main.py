from fastapi import FastAPI, Depends
from database import get_db
from sqlalchemy.orm import Session
from utils.dependencies import get_current_user
from models.user import User
from models.availability import Availability
from models.venue import Venue
from models.venue_category import VenueCategory
from models.venue_image import VenueImage
from models.booking import Booking

from database import Base, engine
from routes import auth, venue_category, venue

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(venue_category.router,
                   prefix="/api/categories", tags=[" Venue Categories"])
app.include_router(venue.router, prefix="/api/venues", tags=["Venue"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "okay"}


@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    return {"status": f"{db}connected"}


@app.get("/me")
def get_user(current_user: User = Depends(get_current_user)):
    return current_user
