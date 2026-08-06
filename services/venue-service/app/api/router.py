from fastapi import APIRouter

from app.api import schedule_groups, venues

api_router = APIRouter()
api_router.include_router(venues.router)
api_router.include_router(schedule_groups.router)
