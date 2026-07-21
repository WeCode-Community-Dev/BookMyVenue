from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.venue_owner import VenueOwner
from app.schemas.venue_owner import VenueOwnerCreate, VenueOwnerProfileCreate
from app.services.auth_service import create_user


def register_venue_owner(db: Session, payload: VenueOwnerCreate) -> User:
    """Brand-new person registering directly as a venue owner.
    Creates the User row (via existing create_user), then the linked VenueOwner row."""
    new_user = create_user(db, payload)  # payload satisfies UserCreate shape too

    venue_owner = VenueOwner(
        user_id=new_user.id,
        business_name=payload.business_name,
        business_address=payload.business_address,
        business_type=payload.business_type,
        contact_person=payload.contact_person,
        business_phone=payload.business_phone,
        business_email=payload.business_email,
        website=payload.website,
        gst_number=payload.gst_number,
        pan_number=payload.pan_number,
    )
    db.add(venue_owner)
    db.commit()
    db.refresh(new_user)

    return new_user


def upgrade_customer_to_owner(db: Session, current_user: User, payload: VenueOwnerProfileCreate) -> User:
    """Existing logged-in customer adding a host profile to their account."""
    existing = db.query(VenueOwner).filter(VenueOwner.user_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a venue owner profile."
        )

    venue_owner = VenueOwner(
        user_id=current_user.id,
        business_name=payload.business_name,
        business_address=payload.business_address,
        business_type=payload.business_type,
        contact_person=payload.contact_person,
        business_phone=payload.business_phone,
        business_email=payload.business_email,
        website=payload.website,
        gst_number=payload.gst_number,
        pan_number=payload.pan_number,
    )
    db.add(venue_owner)
    db.commit()
    db.refresh(current_user)

    return current_user