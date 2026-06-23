from sqlalchemy.orm import Session
from app.models.owner_profile import OwnerProfile
from app.schemas.owner_profile import OwnerProfileCreate

def create_owner_profile(
    db: Session,
    user_id: int,
    profile_data: OwnerProfileCreate
):
    profile = OwnerProfile(
        user_id=user_id,
        business_name=profile_data.business_name
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile

def get_owner_profile(
    db: Session,
    user_id: int
):
    return db.query(OwnerProfile).filter(
        OwnerProfile.user_id == user_id
    ).first()