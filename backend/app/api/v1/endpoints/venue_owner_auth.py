from fastapi import APIRouter, status, Depends, Query
from sqlalchemy.orm import Session

from app.schema.venue_owner_auth_schema import (
    UpdateOwnerStatusRequest,
    UpdateOwnerStatusResponse,
    VenueOwnerOTPRequest,
    VenueOwnerOTPResponse,
    VenueOwnerResponse,
)
from app.schema.base_schema import SuccessResponse
from app.service.venue_owner_auth_service import venue_owner_auth_service
from app.schema.user_auth_schema import (
    OTPVerifyRequest,
    RefreshTokenRequest,
    RefreshTokenResponse,
    TokenResponse,
)
from app.config.database import get_db
from app.config.dependencies import get_current_admin, get_current_user
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


@router.post(
    "/refresh-token",
    response_model=SuccessResponse[RefreshTokenResponse],
    status_code=status.HTTP_201_CREATED,
)
async def refresh_token(data: RefreshTokenRequest):
    user = await venue_owner_auth_service.refresh_token_user(data)
    return SuccessResponse(message="Token refreshed successfully", data=user)


@router.patch(
    "/update-status",
    response_model=SuccessResponse[UpdateOwnerStatusResponse],
    status_code=status.HTTP_200_OK,
)
def update_status(
    data: UpdateOwnerStatusRequest,
    db: Session = Depends(get_db),
    # current_admin=Depends(get_current_admin),
):
    result = venue_owner_auth_service.update_status(
        db=db,
        owner_id=data.owner_id,
        status=data.status,
    )

    return SuccessResponse(
        message="Owner status updated successfully",
        data=result,
    )


# Get all Venue owner details
@router.get(
    "/profile",
    response_model=SuccessResponse[VenueOwnerResponse],
    summary="Get owner profile",
    description="Get owner details based on token",
)
def get_owner_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    owner_profile = venue_owner_auth_service.get_owner_profile(
        db=db, owner_id=current_user.id
    )
    return SuccessResponse(
        message="Owner profile retrieved successfully",
        data=owner_profile,
    )


# Get all Venue owner details
@router.get(
    "",
    response_model=SuccessResponse[list[VenueOwnerResponse]],
    summary="Get all venue owners",
    description="Get all venue owners details with owner profile data",
)
def get_all_venue_owners(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    venue_owners = venue_owner_auth_service.get_all_venue_owners(
        db=db,
        skip=skip,
        limit=limit,
    )

    return SuccessResponse(
        message="Venue owners fetched successfully",
        data=venue_owners,
    )
