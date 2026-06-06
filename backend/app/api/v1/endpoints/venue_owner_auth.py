from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.schema.venue_owner_auth_schema import (
    CreateOwnerProfileRequest,
    OwnerProfileResponse,
    VenueOwnerOTPRequest,
    VenueOwnerOTPResponse,
)
from app.schema.base_schema import SuccessResponse
from app.service.venue_owner_auth_service import venue_owner_auth_service
from app.schema.user_auth_schema import OTPVerifyRequest, TokenResponse
from app.config.database import get_db
from app.config.dependencies import get_current_user
from app.model.user import User

router = APIRouter()


## Venue owner Auth Endpoint
# Register owner with mobile number and get OTP
@router.post(
    "/request-otp",
    response_model=SuccessResponse[VenueOwnerOTPResponse],
    status_code=status.HTTP_200_OK,
    summary="Request mobile verification OTP code For Owner verification",
    description="Generates an OTP code, saves it in cache with expiration TTL, logs it, and returns it for development ease.",
)
def request_otp(
    data: VenueOwnerOTPRequest,
    db: Session = Depends(get_db),
):
    result = venue_owner_auth_service.request_otp(db=db, data=data)
    return SuccessResponse(message="OTP code generated successfully.", data=result)


# Verify OTP
@router.post(
    "/verify-otp",
    response_model=SuccessResponse[TokenResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Submit and verify mobile OTP code",
    description="Submits the OTP code to verify mobile number. If verified successfully, retrieves or creates the user and issues token pairs.",
)
def verify_otp(
    data: OTPVerifyRequest, db: Session = Depends(get_db)
) -> SuccessResponse:
    result = venue_owner_auth_service.verify_otp(db=db, data=data)
    return SuccessResponse(message="OTP sent Successfully", data=result)


# Create business profile
@router.post(
    "/profile",
    response_model=SuccessResponse[OwnerProfileResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create owner profile",
    description="Collect Owner profile details like business type and name",
)
def create_business_profile(
    data: CreateOwnerProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = venue_owner_auth_service.create_business_profile(
        db=db, data=data, user_id=current_user.id
    )
    return SuccessResponse(message="Business profile created successfully", data=result)
