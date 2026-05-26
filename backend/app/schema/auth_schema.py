from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import re


## Admin Auth Schema
class AdminAuthRequest(BaseModel):
    email: str
    password: str


class AdminAuthResponse(BaseModel):
    email: str
    is_authenticated: bool


## Venue owner Auth Schema


## User/Customer Auth Schema
# Strict Indian mobile number regex pattern (+91 followed by exactly 10 digits starting with 6-9)
PHONE_REGEX = re.compile(r"^\+91[6-9]\d{9}$")


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
    Serialized view of the database User model.
    """

    id: int
    mobile_number: str
    is_active: bool
    created_at: datetime

    class Config:
        # Enable compatibility with SQLAlchemy models (Pydantic v2 style)
        from_attributes = True


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
