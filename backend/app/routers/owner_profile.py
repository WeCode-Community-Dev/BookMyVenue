from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
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
    db: Session = Depends(get_db)
):
    return create_owner_profile(
        db,
        user_id=1,
        profile_data=profile
    )

@router.get("/", response_model=OwnerProfileOut)
def get_profile(
    db: Session = Depends(get_db)
):
    return get_owner_profile(
        db,
        user_id=1
    )