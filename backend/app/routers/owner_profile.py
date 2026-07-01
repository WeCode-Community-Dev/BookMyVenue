from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.owner_profile import (
    OwnerProfileCreate,
    OwnerProfileOut
)
from app.services.owner_profile_service import (
    create_owner_profile,
    get_owner_profile
)



router = APIRouter(
    prefix="/owner-profile",
    tags=["Owner Profile"]
)

@router.post("/", response_model=OwnerProfileOut)
def create_profile(
    profile: OwnerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create owner profile for the logged-in user"""
    return create_owner_profile(
        db,
        user_id=current_user.id,
        profile_data=profile
    )

@router.get("/", response_model=OwnerProfileOut)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get owner profile for the logged-in user"""
    return get_owner_profile(
        db,
        user_id=current_user.id
    )