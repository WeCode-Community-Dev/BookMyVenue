from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router

app = FastAPI(
    title="Book my venue API",
    description="Backend API for Book my venue",
    version="1.0.0",
)


# Allowed origins
origins = [
    "http://localhost",
    "http://localhost:3000",  # React or frontend running locally
    "http://localhost:5000",  # Flutter web URL
    "http://localhost:4200",  # Angular frontend
    "http://127.0.0.1:5500",  # Example: local HTML/JS testing
    # "https://yourdomain.com",  # Production frontend
    "*",  # (not recommended for production, allows all origins)
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies/auth headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):

    return JSONResponse(
        status_code=exc.status_code,
        content={"status": False, "message": exc.detail},
    )


app.include_router(api_router, prefix="/api/v1")
