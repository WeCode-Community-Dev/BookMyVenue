from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from app.schemas.user import UserCreate


# Used when a brand-new person registers directly as a venue owner.
# Inherits name, email, phone_number, password from UserCreate.
class VenueOwnerCreate(UserCreate):
    business_name: str
    business_address: str
    business_type: str | None = None
    contact_person: str | None = None
    business_phone: str | None = None
    business_email: EmailStr | None = None
    website: str | None = None
    gst_number: str | None = None
    pan_number: str | None = None


# Used when an already-logged-in customer adds a host profile.
# No account fields needed — current_user comes from the JWT.
class VenueOwnerProfileCreate(BaseModel):
    business_name: str
    business_address: str
    business_type: str | None = None
    contact_person: str | None = None
    business_phone: str | None = None
    business_email: EmailStr | None = None
    website: str | None = None
    gst_number: str | None = None
    pan_number: str | None = None


class VenueOwnerOut(BaseModel):
    id: int
    business_name: str
    business_address: str
    business_type: str | None = None
    contact_person: str | None = None
    business_phone: str | None = None
    business_email: EmailStr | None = None
    website: str | None = None
    gst_number: str | None = None
    pan_number: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}