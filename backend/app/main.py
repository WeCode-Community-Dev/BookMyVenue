from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import settings
from app.config.database import Base, engine

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)


# Add CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):

    return JSONResponse(
        status_code=exc.status_code,
        content={"status": False, "message": exc.detail},
    )


# Attach routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health Check"], summary="General system status indicator")
def system_health() -> dict:
    """
    Returns general system metrics indicating application health and instructions.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "interactive_docs": "/docs",
        "alternative_docs": "/redoc",
    }


Base.metadata.create_all(engine)
