from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.schema.venue_owner_auth_schema import (
    VenueOwnerOTPRequest,
    VenueOwnerOTPResponse,
)
from app.schema.base_schema import SuccessResponse
from app.service.venue_owner_auth_service import venue_owner_auth_service
from app.schema.user_auth_schema import OTPVerifyRequest, TokenResponse
from app.config.database import get_db

router = APIRouter()


## Venue owner Auth Endpoint
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
    status_code=status.HTTP_200_OK,
    summary="Submit and verify mobile OTP code",
    description="Submits the OTP code to verify mobile number. If verified successfully, retrieves or creates the user and issues token pairs.",
)
def verify_otp(
    data: OTPVerifyRequest, db: Session = Depends(get_db)
) -> SuccessResponse:
    result = venue_owner_auth_service.verify_otp(db=db, data=data)
    return SuccessResponse(message="OTP sent Successfully", data=result)
