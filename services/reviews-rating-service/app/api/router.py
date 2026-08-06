from fastapi import APIRouter

from app.api import reviews

api_router = APIRouter()
api_router.include_router(reviews.router)
