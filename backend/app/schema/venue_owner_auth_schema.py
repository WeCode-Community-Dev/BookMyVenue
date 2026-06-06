import re

from pydantic import BaseModel, ConfigDict,EmailStr, Field, field_validator


from app.config.constant import PHONE_REGEX

## Venue owner Auth Schema
class VenueOwnerOTPRequest(BaseModel):
    """
    Request OTP for Venue Owner Registration
    """

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",  # Reject unexpected fields
    )

    full_name: str = Field(
        ...,
        min_length=3,
        max_length=50,
        description="Venue owner full name",
        examples=["Sanju Samson"],
    )

    email: EmailStr = Field(
        ...,
        description="Valid email address",
        examples=["abc@example.com"],
    )

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Strong password",
        examples=["MyStrong@123"],
    )

    mobile_number: str = Field(
        ...,
        description="Indian mobile number with +91 country code",
        examples=["+919876543210"],
    )

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        value = " ".join(value.split())

        if not re.match(r"^[A-Za-z\s.'-]+$", value):
            raise ValueError(
                "Full name can only contain letters, spaces, apostrophes, dots and hyphens."
            )

        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr) -> str:
        return value.lower().strip()

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, value: str) -> str:
        cleaned = "".join(value.split())

        if not PHONE_REGEX.match(cleaned):
            raise ValueError(
                "Invalid mobile number. Format should be +919876543210."
            )

        return cleaned

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return value

class VenueOwnerOTPResponse(BaseModel):
    full_name:str
    email:str
    mobile_number: str
    otp: str = Field(
        ...,
        description="Returned for development/testing convenience. In production, this goes only to SMS.",
    )
    expires_in_seconds: int
    message: str

# ====================================================================
