import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import List, Dict, Any, Optional

class ClerkEmailAddress(BaseModel):
    email_address: EmailStr
    id: str

class ClerkWebhookData(BaseModel):
    id: str  # This is the Clerk User ID (e.g., user_2F...)
    email_addresses: Optional[List[ClerkEmailAddress]] = None
    first_name: Optional[str] = None
    username: Optional[str] = None
    last_name: Optional[str] = None
    image_url: Optional[str] = None
    primary_email_address_id: Optional[str] = None
    profile_image_url: Optional[str] = None
    deleted:Optional[bool] = True
    object:str = "user"


class ClerkWebhookEvent(BaseModel):
    data: ClerkWebhookData
    object: str  # Will be "event"
    type: str    # e.g., "user.created" or "user.updated"


class UserBase(BaseModel):
    clerkUserID: str
    username: str 
    email: EmailStr 
    fullname: str
    phone: Optional[str] = Field(default=None, max_length=10) 

class UserSchema(UserBase):
    """
    Schema for reading user data (Output/Response)
    """
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    def __repr__(self) -> str:
        return f"<UserSchema(username={self.username!r}, email={self.email!r})>" 
    
class PhoneOnboardingSchema(BaseModel):
    phone: str = Field(max_length=10)