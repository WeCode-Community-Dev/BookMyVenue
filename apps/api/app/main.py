import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.middleware import register_middleware
from app.jobs import scheduler as job_scheduler
from app.modules.auth.routes import router as auth_router
from app.modules.profile.routes import router as profile_router
from app.modules.venue.routes import router as venue_router
from app.modules.search.routes import router as search_router
from app.modules.booking.routes import router as booking_router
from app.modules.availability.routes import router as availability_router
from app.modules.notification.routes import router as notification_router
from app.modules.admin.routes import router as admin_router
from app.modules.payment.routes import router as payment_router
from app.modules.internal.routes import router as internal_router
from app.modules.owner.routes import router as owner_router
from app.modules.admin.service import seed_super_admin


logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    setup_logging()
    seed_super_admin()
    if settings.enable_jobs:
        logger.info("ENABLE_JOBS=true — starting background scheduler")
        job_scheduler.start()
    else:
        logger.info("ENABLE_JOBS=false — background scheduler not started")
    yield
    if settings.enable_jobs:
        job_scheduler.shutdown()


app = FastAPI(title="Venue404 API", lifespan=lifespan)

register_middleware(app)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(profile_router, prefix="/api/profile", tags=["profile"])
app.include_router(venue_router, prefix="/api/venues", tags=["venues"])
app.include_router(search_router, prefix="/api/search", tags=["search"])
app.include_router(booking_router, prefix="/api/bookings", tags=["bookings"])
app.include_router(availability_router, prefix="/api/availability", tags=["availability"])
app.include_router(notification_router, prefix="/api/notifications", tags=["notifications"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(payment_router, prefix="/api/payments", tags=["payments"])
app.include_router(internal_router, prefix="/api/internal", tags=["internal"])
app.include_router(owner_router, prefix="/api/owner", tags=["owner"])

@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
