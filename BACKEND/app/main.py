from fastapi import FastAPI

from app.db.database import Base, engine
from app.model.user import User 
from app.model.venue import Venue
from app.model.venue_amenities import VenueAmenities
from app.model.venue_images import VenueImages

from app.api.user_routes import router as user_router
from app.api.auth_routes import router as auth_router
from app.api.venue_routes import router as venue_router
from fastapi.middleware.cors import CORSMiddleware

    
app = FastAPI()

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    print(Base.metadata.tables.keys())

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(venue_router)


@app.get("/")
def read_root():
    return {
        "message": "API Running"
    }
