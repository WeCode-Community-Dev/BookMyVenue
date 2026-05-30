# authentocation routes
from fastapi import APIRouter

router = APIRouter()

# login route
@router.post("/login")
async def login():
    return {
        "message": "Login endpoint"
    }