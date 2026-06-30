from __future__ import annotations

import enum
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr

from app.modules.users.model import UserRole

class UserBase(BaseModel):
    email: EmailStr
    name: str


class SignupRole(str, enum.Enum):
    """Roles a client is allowed to self-select at signup.
    Admin can never be self-assigned."""
    user = "user"
    owner = "owner"


class UserCreate(UserBase):
    password: str
    role: SignupRole = SignupRole.user


class UserGoogleCreate(BaseModel):
    email: EmailStr
    name: str
    google_sub: str
    role: UserRole = UserRole.user


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    name: str
    role: UserRole
    google_sub: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None


class OwnerProfileCreate(BaseModel):
    business_name: str
    contact_phone: Optional[str] = None
    payout_info: Optional[str] = None


class OwnerProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    business_name: str
    contact_phone: Optional[str] = None
    payout_info: Optional[str] = None
    created_at: datetime
