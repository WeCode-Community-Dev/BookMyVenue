# users routes
from fastapi import APIRouter
# add the protect route

router = APIRouter()


# list the users
@router.get("/")
async def get_users():
    return {
        "message": "List users"
    }