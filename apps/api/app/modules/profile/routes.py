from fastapi import APIRouter, Depends

from app.modules.auth.dependencies import get_current_user
from app.modules.profile import service
from app.modules.profile.schemas import ProfileResponse, UpdateProfileRequest

router = APIRouter()


@router.get("/me", response_model=ProfileResponse)
def get_profile(user=Depends(get_current_user)):
    return service.get_profile(user["sub"])


@router.patch("/me", response_model=ProfileResponse)
def update_profile(body: UpdateProfileRequest, user=Depends(get_current_user)):
    return service.update_profile(user["sub"], body)
