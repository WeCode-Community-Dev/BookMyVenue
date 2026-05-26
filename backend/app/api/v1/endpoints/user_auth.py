from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from app.schema.auth_schema import (
    OTPRequest,
    OTPResponse,
    OTPVerifyRequest,
    TokenResponse,
)
from app.schema.base_schema import SuccessResponse
from app.service.auth_service import auth_service
from app.config.database import get_db

router = APIRouter()
## Venue owner Auth Endpoint


## User/Customer Auth Endpoint
# Register mobile number and get OTP
@router.post(
    "/request-otp",
    response_model=SuccessResponse[OTPResponse],
    status_code=status.HTTP_200_OK,
    summary="Request mobile verification OTP code",
    description="Generates an OTP code, saves it in cache with expiration TTL, logs it, and returns it for development ease.",
)
def request_otp(data: OTPRequest):
    result = auth_service.request_otp(mobile_number=data.mobile_number)
    return SuccessResponse(message="OTP code generated successfully.", data=result)


# Verify OTP
@router.post(
    "/verify_otp",
    response_model=SuccessResponse[TokenResponse],
    status_code=status.HTTP_200_OK,
    summary="Submit and verify mobile OTP code",
    description="Submits the OTP code to verify mobile number. If verified successfully, retrieves or creates the user and issues token pairs.",
)
def verify_otp(
    data: OTPVerifyRequest, db: Session = Depends(get_db)
) -> SuccessResponse:
    result = auth_service.verify_otp(db=db, data=data)
    return SuccessResponse(message="OTP sent Successfully", data=result)
