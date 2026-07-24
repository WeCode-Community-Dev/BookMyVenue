from pydantic import BaseModel, EmailStr, Field
from typing import Literal
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone_number: str
    password: str = Field(..., min_length=8, max_length=72)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str | None = None
    email: EmailStr
    phone_number: str | None = None
    role: str
    is_active: bool
    auth_provider: str
    created_at: datetime
    is_venue_owner: bool = False

    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefreshOut(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class GoogleAuthRequest(BaseModel):
    id_token: str


class UserProfileUpdate(BaseModel):
    name: str | None = None
    phone_number: str | None = None
    password: str | None = Field(default=None, min_length=8, max_length=72)
