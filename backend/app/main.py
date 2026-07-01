import logging
from contextlib import asynccontextmanager

from sqlalchemy import text
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine, SessionLocal

# Models
from app.models import (
    user,
    venue,
    amenity,
    venue_amenity,
    owner_profile,
    booking,
    payment,
)

# Routers
from app.routers import (
    auth,
    venue,
    amenity,
    venue_amenity,
    owner_profile,
    bookings,
    payments,
)

from app.seeds.amenity_seed import seed_amenities

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bookmyvenue")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify the database connection on startup
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        logger.info("Database is connected")
        
        # Seed initial amenities
        db = SessionLocal()
        try:
            seed_amenities(db)
            logger.info("Amenities seeded successfully")
        finally:
            db.close()
            
    except Exception as exc:
        logger.error("Database connection failed: %s", exc)
        raise
    yield


# Create all tables when the app starts
Base.metadata.create_all(bind=engine)

# Creating the FastAPI app
app = FastAPI(
    title = "BookMyVenue API",
    description = "Backend for the BookMyVenue platform",
    version = "1.0.0",
    lifespan=lifespan,
)

# Defining which origins are allowed to talk to this backend
origins = [
    "http://localhost:5173",
    "http://localhost:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(auth.router)
app.include_router(venue.router)
app.include_router(amenity.router)
app.include_router(venue_amenity.router)
app.include_router(owner_profile.router)
app.include_router(bookings.router)
app.include_router(payments.router)


@app.get("/")
def root():
    return {"message": "BookMyVenue API is running"}

@app.get("/health")
def health():
    return {"message": "This service is healthy"}