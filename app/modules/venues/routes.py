# venues routes
from fastapi import APIRouter

router = APIRouter()


# list the users
@router.get("/venues")
async def get_venues():
    return {
        "message": "List venues"
    }