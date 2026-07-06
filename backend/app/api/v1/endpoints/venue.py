from typing import List
from uuid import UUID

from fastapi import APIRouter, status, Depends, Query
from sqlalchemy.orm import Session

from app.schema.base_schema import SuccessResponse
from app.schema.venue_schema import (
    AmenityRequest,
    AmenityResponse,
    CreateVenueRequest,
    CreateVenueResponse,
    DeleteAmenityResponse,
    UpdateVenueStatusRequest,
    UpdateVenueStatusResponse,
    VenueResponse,
)
from app.service.venue_service import venue_service
from app.config.database import get_db
from app.config.dependencies import get_current_user
from app.model.user import User

"""
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODM3MDc4NDEsInN1YiI6ImYzNmE0YjEzLWYzODEtNDU4ZS1hZTNmLWJiMTI4MTY5ODNmNSIsInR5cGUiOiJhY2Nlc3MifQ.pSa32_g9WPD_BG1bGOWQiu2ucmLS5I2zdGhankdnMmY
1. Create a new venue ✅
2. List all venue to admin
3. Admin approve/reject venue
4. List approved venue to user
5. Delete venue by venue owner
6. update venue details by venue owner -> goes to approval status pending
"""


router = APIRouter()


@router.post(
    "/create",
    response_model=SuccessResponse[CreateVenueResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create venue",
    description="Create a new venue by venue owner",
)
def create_new_venue(
    data: CreateVenueRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = venue_service.create_new_venue(
        db=db,
        owner_id=current_user.id,
        data=data,
    )

    return SuccessResponse(
        message="Venue created successfully and submitted for verification.",
        data=result,
    )


@router.get(
    "",
    response_model=SuccessResponse[List[VenueResponse]],
    status_code=status.HTTP_200_OK,
    summary="Get all venues",
    description="Get all Venues and listed to admin",
)
def get_all_venues(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    approved: bool = Query(False),
    owner_id: UUID | None = Query(default=None),
    db: Session = Depends(get_db),
):
    result = venue_service.get_all_venues(
        db=db,
        skip=skip,
        limit=limit,
        approved=approved,
        owner_id=owner_id,
    )

    return SuccessResponse(
        message="Venues list retrieved successfully",
        data=result,
    )

@router.patch(
    "/update-status",
    response_model=SuccessResponse[UpdateVenueStatusResponse],
    status_code=status.HTTP_200_OK,
)
def update_status(
    data: UpdateVenueStatusRequest,
    db: Session = Depends(get_db),
    # current_admin=Depends(get_current_admin),
):
    result = venue_service.update_verification_status(
        db=db,
        venue_id=data.venue_id,
        status=data.status,
        rejection_reason=data.rejection_reason,
    )

    return SuccessResponse(
        message="Venue verification status updated successfully",
        data=result,
    )


@router.get(
    "/amenities",
    response_model=SuccessResponse[List[AmenityResponse]],
    status_code=status.HTTP_200_OK,
    summary="Get all amenities",
    description="Get all amenities",
)
def get_all_amenities(
    db: Session = Depends(get_db),
    # TODO(Jiyad): Separate get api for user and admin
):
    result = venue_service.get_all_amenities(db=db)

    return SuccessResponse(
        message="Amenities list retrieved successfully",
        data=result,
    )


@router.post(
    "/amenities",
    response_model=SuccessResponse[AmenityResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create amenities",
    description="Admin Create all amenities",
)
def create_amenity(
    data: AmenityRequest,
    db: Session = Depends(get_db),
):
    result = venue_service.create_amenity(data=data, db=db)

    return SuccessResponse(
        message="Amenities created successfully",
        data=result,
    )


@router.delete(
    "/amenities/{amenity_id}",
    response_model=SuccessResponse[DeleteAmenityResponse],
    status_code=status.HTTP_200_OK,
    summary="Delete amenities",
    description="Admin Delete amenities by id",
)
def delete_amenity(
    amenity_id: UUID,
    db: Session = Depends(get_db),
):
    result = venue_service.delete_amenity(db=db, amenity_id=amenity_id)

    return SuccessResponse(
        message="Amenities deleted successfully",
        data=result,
    )


@router.get(
    "/{venue_id}",
    response_model=VenueResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Venue by ID",
    description="Retrieves a specific venue by its ID (no token required).",
)
def get_venue_by_id(
    venue_id: UUID,
    db: Session = Depends(get_db),
):
    return venue_service.get_venue_by_id(db=db, venue_id=venue_id)
