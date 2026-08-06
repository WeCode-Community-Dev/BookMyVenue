from fastapi import APIRouter
from app.api import users

api_router = APIRouter()

api_router.include_router(users.router)