# users routes
from fastapi import APIRouter

router = APIRouter()


# list the users
@router.get("/")
async def get_users():
    return {
        "message": "List users"
    }