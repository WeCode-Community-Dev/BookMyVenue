import logging
from contextlib import asynccontextmanager

from sqlalchemy import text
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from sqlalchemy import text
from app.db.database import Base, engine, SessionLocal
from app.seeds.venue_type_seed import seed_venue_types
from app.seeds.amenity_seed import seed_amenities
from app.models import user, venue, booking, payment, venue_owner, review, notification, amenity, venue_amenity, venue_type
from app.routers import auth,bookings,payments, venue_owner as venue_owner_router, venue as venue_router, venue_owner_dashboard, venue_type as venue_type_router, amenity as amenity_router, venue_amenity as venue_amenity_router, review

from app.db.database import Base, engine, SessionLocal



from app.seeds.amenity_seed import seed_amenities

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
    admin,
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
    
    seed_db = SessionLocal()
    try:
        seed_venue_types(seed_db)
        seed_amenities(seed_db)
    finally:
        seed_db.close()
    
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


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


app.include_router(auth.router)
app.include_router(amenity_router.router)
app.include_router(venue_amenity_router.router)
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(venue_owner_router.router)
app.include_router(venue_router.router)
app.include_router(venue_owner_dashboard.router)
app.include_router(venue_type_router.router)
app.include_router(review.router)

@app.get("/")
def root():
    return {"message": "BookMyVenue API is running"}

@app.get("/health")
def health():
    return {"message": "This service is healthy"}
