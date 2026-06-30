from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.db.base import Base
from app.db.session import engine

API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: ARG001
    # Auto-create tables only for local SQLite development convenience.
    # Non-development deployments must apply schema via Alembic migrations
    # (`alembic upgrade head`) so alembic_version stays in sync.
    if settings.ENVIRONMENT == "development" and settings.DATABASE_URL.startswith(
        "sqlite"
    ):
        import app.models  # noqa: F401  (ensure models imported)

        Base.metadata.create_all(bind=engine)
    yield


def create_app() -> FastAPI:
    app = FastAPI(title=settings.APP_NAME, version="0.1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    # Register routers
    from app.modules.admin.router import router as admin_router
    from app.modules.admin.service import router as admin_overview_router
    from app.modules.auth.router import router as auth_router
    from app.modules.bookings.router import (
        owner_bookings_router,
        router as bookings_router,
    )
    from app.modules.users.router import router as users_router
    from app.modules.venues.router import owner_router, router as venues_router

    app.include_router(auth_router, prefix=API_PREFIX)
    app.include_router(users_router, prefix=API_PREFIX)
    app.include_router(venues_router, prefix=API_PREFIX)
    app.include_router(owner_router, prefix=API_PREFIX)
    app.include_router(bookings_router, prefix=API_PREFIX)
    app.include_router(owner_bookings_router, prefix=API_PREFIX)
    app.include_router(admin_router, prefix=API_PREFIX)
    app.include_router(admin_overview_router, prefix=API_PREFIX)

    @app.get("/health")
    def health():
        return {"status": "ok", "app": settings.APP_NAME}

    return app


app = create_app()
