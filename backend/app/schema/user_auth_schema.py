from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator
from datetime import datetime

from app.config.constant import PHONE_REGEX
from app.model.user import UserRole, UserStatus


## Admin Auth Schema
class AdminAuthRequest(BaseModel):
    email: str
    password: str


class AdminAuthResponse(BaseModel):
    email: str
    is_authenticated: bool


# ====================================================================

## User/Customer Auth Schema
"""
class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
"""


class OTPRequest(BaseModel):
    """
    Schema for requesting a new OTP.
    """

    mobile_number: str = Field(
        ...,
        description="Indian mobile number with +91 country code, e.g. +919876543210",
        examples=["+919876543210"],
    )

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, v: str) -> str:
        # Strip all whitespace
        cleaned = "".join(v.split())
        if not PHONE_REGEX.match(cleaned):
            raise ValueError(
                "Invalid mobile number format. Must be a valid 10-digit Indian mobile number "
                "with country code (e.g., +919876543210)."
            )
        return cleaned


class OTPResponse(BaseModel):
    """
    Response schema returning details of the generated OTP.
    """

    mobile_number: str
    otp: str = Field(
        ...,
        description="Returned for development/testing convenience. In production, this goes only to SMS.",
    )
    expires_in_seconds: int
    message: str


class OTPVerifyRequest(BaseModel):
    """
    Schema for submitting and verifying an OTP.
    """

    mobile_number: str
    otp: str = Field(
        ..., min_length=4, max_length=8, description="The digit code sent via SMS"
    )

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, v: str) -> str:
        cleaned = "".join(v.split())
        if not PHONE_REGEX.match(cleaned):
            raise ValueError("Invalid mobile number format.")
        return cleaned


class UserResponse(BaseModel):
    """
    Serialized view of the User model.
    """

    id: UUID

    mobile_number: str

    full_name: str | None = None
    email: str | None = None

    mobile_verified: bool
    email_verified: bool

    role: UserRole
    status: UserStatus

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """
    Standard OAuth2/JWT token response.
    """

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    """
    Schema for renewing access token using a refresh token.
    """

    refresh_token: str


class RefreshTokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
