from fastapi import FastAPI
# import all the routes below here 
from app.modules.auth.routes import router as auth_router
from app.modules.auth.routes import router as users_router


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


# health status check
@app.get("/")
async def root():
    return { 
        "status":"healthy"
    }


@app.get("/info")
def get_info():
    return { 
        "sucess":True,
        "message":"Welcome to BookmyVenue API"
    }

