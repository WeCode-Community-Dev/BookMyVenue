from fastapi import APIRouter

from app.api.v1.endpoints import admin_auth
from app.api.v1.endpoints import user_auth
from app.api.v1.endpoints import venue_owner_auth

api_router = APIRouter()

# /api/v1/admin/auth/
api_router.include_router(
    admin_auth.router, prefix="/admin/auth", tags=["Admin Authentication"]
)

# /api/v1/auth/
api_router.include_router(user_auth.router, prefix="/auth", tags=["User Authentication"])

# /api/v1/auth/venue-owner/
api_router.include_router(venue_owner_auth.router, prefix="/auth/venue-owner", tags=["Venue owner Authentication"])
