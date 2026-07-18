from fastapi import APIRouter, status, Depends, Query
from sqlalchemy.orm import Session
from app.schema.user_auth_schema import (
    OTPRequest,
    OTPResponse,
    OTPVerifyRequest,
    TokenResponse,
    UserResponse,
    UserProfileUpdateRequest,
)
from app.schema.base_schema import SuccessResponse
from app.service.user_auth_service import user_auth_service
from app.config.database import get_db
from app.config.dependencies import get_current_user
from app.model.user import User

router = APIRouter()


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
    result = user_auth_service.request_otp(mobile_number=data.mobile_number)
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
    result = user_auth_service.verify_otp(db=db, data=data)
    return SuccessResponse(message="OTP sent Successfully", data=result)


# Get all user details
@router.get(
    "/users",
    response_model=SuccessResponse[list[UserResponse]],
    summary="Get all users",
    description="Get all users details",
)
def get_all_venue_owners(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    venue_owners = user_auth_service.get_all_users(
        db=db,
        skip=skip,
        limit=limit,
    )

    return SuccessResponse(
        message="Users details fetched successfully",
        data=venue_owners,
    )


@router.get(
    "/user/profile",
    response_model=SuccessResponse[UserResponse],
    summary="Get user profile",
    description="Get user details based on token",
)
def get_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_profile = user_auth_service.get_user_profile(db=db, user_id=current_user.id)
    return SuccessResponse(
        message="User profile retrieved successfully",
        data=user_profile,
    )


@router.patch(
    "/user/profile",
    response_model=SuccessResponse[UserResponse],
    summary="Update user profile",
    description="Updates the profile information (full_name and email) of the authenticated user.",
)
def update_user_profile(
    data: UserProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated_profile = user_auth_service.update_user_profile(
        db=db,
        user_id=current_user.id,
        data=data,
    )
    return SuccessResponse(
        message="User profile updated successfully.",
        data=updated_profile,
    )
