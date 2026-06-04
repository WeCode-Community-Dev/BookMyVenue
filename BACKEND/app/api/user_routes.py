from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.get("/profile")
def profile(
    current_user=Depends(get_current_user)
):
    return {
        "message": "Authorized",
        "user": current_user
    }