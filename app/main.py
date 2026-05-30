from fastapi import FastAPI,Depends
# import all the routes below here 
from app.modules.auth.routes import router as auth_router
from app.modules.auth.routes import router as users_router
# import database related files here
from app.db.init_db import init_db
from app.db.dependencies import get_db
from sqlalchemy.orm import Session


# app metadata
app = FastAPI(
    title="BookMyVenue API",
    description="Venue Booking Platform API",
    version="1.0.0"
)

# define the auth router url
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
# add the users router url 
app.include_router(users_router, prefix="/api/users", tags=["Users"])


# create tables on startup or checked here
@app.on_event("startup")
def startup():
    init_db()

# health status check
@app.get("/")
async def root():
    return { 
        "status":"healthy"
    }

# get the basic info of the project
@app.get("/info")
def get_info(db: Session = Depends(get_db)):
    return { 
        "sucess":True,
        "message": "DB Connected.."
    }

