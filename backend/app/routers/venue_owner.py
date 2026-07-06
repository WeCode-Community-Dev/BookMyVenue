from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.venue_owner import VenueOwnerCreate, VenueOwnerProfileCreate
from app.schemas.user import UserOut, TokenOut
from app.services.venue_owner_service import register_venue_owner, add_venue_owner_profile
from app.core.security import create_access_token, get_current_user
from app.models.user import User


router = APIRouter(prefix="/venue-owners", tags=["Venue Owners"])


@router.post("/register", response_model=TokenOut)
def register(payload: VenueOwnerCreate, db: Session = Depends(get_db)):
    """Brand-new person registering directly as a venue owner — auto-login after."""
    user = register_venue_owner(db, payload)
    access_token = create_access_token(data={"sub": str(user.id)})
    return TokenOut(access_token=access_token)


@router.post("/profile", response_model=UserOut)
def add_profile(
    payload: VenueOwnerProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Existing logged-in customer adding a host profile."""
    user = add_venue_owner_profile(db, current_user, payload)
    return UserOut(
        id=user.id,
        name=user.name,
        email=user.email,
        phone_number=user.phone_number,
        role=user.role,
        is_active=user.is_active,
        auth_provider=user.auth_provider,
        created_at=user.created_at,
        is_venue_owner=user.venue_owner_profile is not None,
    )