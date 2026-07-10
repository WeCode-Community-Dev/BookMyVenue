import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.logging import setup_logging
from app.core.middleware import register_middleware
from app.jobs import scheduler as job_scheduler
from app.modules.admin.routes import router as admin_router
from app.modules.admin.service import seed_super_admin
from app.modules.auth.routes import router as auth_router
from app.modules.availability.routes import router as availability_router
from app.modules.booking.routes import router as booking_router
from app.modules.deep_research.routes import router as deep_research_router
from app.modules.internal.routes import router as internal_router
from app.modules.notification.routes import router as notification_router
from app.modules.owner.routes import router as owner_router
from app.modules.payment.routes import router as payment_router
from app.modules.profile.routes import router as profile_router
from app.modules.review.routes import router as review_router
from app.modules.search import query_normalizer, search_metadata_cache
from app.modules.search.routes import router as search_router
from app.modules.venue.routes import router as venue_router

logger = logging.getLogger(__name__)


def _load_search_metadata() -> None:
    """Populate the search metadata cache (category boost groups, keyword
    expansion, query-normalizer vocabulary) from the DB. Runs at startup so
    none of it is hardcoded in the search module — see
    app/modules/search/search_metadata_cache.py.
    """
    with SessionLocal() as db:
        search_metadata_cache.load_category_metadata(db)
        vocabulary = search_metadata_cache.build_query_vocabulary(db)
        query_normalizer.set_dynamic_vocabulary(vocabulary)


@asynccontextmanager
async def lifespan(_: FastAPI):
    setup_logging()
    seed_super_admin()
    _load_search_metadata()
    if settings.enable_jobs:
        logger.info("ENABLE_JOBS=true — starting background scheduler")
        job_scheduler.start()
    else:
        logger.info("ENABLE_JOBS=false — background scheduler not started")
    yield
    if settings.enable_jobs:
        job_scheduler.shutdown()


# Disable the interactive docs (/docs, /redoc) in production so the full API
# surface isn't publicly listed; keep them in development.
app = FastAPI(
    title="Venue404 API",
    lifespan=lifespan,
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json",
)

register_middleware(app)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(profile_router, prefix="/api/profile", tags=["profile"])
app.include_router(venue_router, prefix="/api/venues", tags=["venues"])
app.include_router(review_router, prefix="/api", tags=["reviews"])
app.include_router(search_router, prefix="/api/search", tags=["search"])
app.include_router(booking_router, prefix="/api/bookings", tags=["bookings"])
app.include_router(
    availability_router, prefix="/api/availability", tags=["availability"]
)
app.include_router(
    notification_router, prefix="/api/notifications", tags=["notifications"]
)
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(payment_router, prefix="/api/payments", tags=["payments"])
app.include_router(internal_router, prefix="/api/internal", tags=["internal"])
app.include_router(owner_router, prefix="/api/owner", tags=["owner"])
app.include_router(
    deep_research_router, prefix="/api/deep-research", tags=["deep-research"]
)


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
