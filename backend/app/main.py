from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine
from app.models import user, venue, booking, payment
from app.routers import auth,bookings,payments




# Create all tables when the app starts
Base.metadata.create_all(bind=engine)

# Creating the FastAPI app
app = FastAPI(
    title = "BookMyVenue API",
    description = "Backend for the BookMyVenue platform",
    version = "1.0.0"
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
app.include_router(bookings.router) 
app.include_router(payments.router)


@app.get("/")
def root():
    return {"message": "BookMyVenue API is running"}