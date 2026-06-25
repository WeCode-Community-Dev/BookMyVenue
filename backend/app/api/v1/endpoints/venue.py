from typing import List

from fastapi import APIRouter, status, Depends, Query
from sqlalchemy.orm import Session

from app.schema.base_schema import SuccessResponse
from app.schema.venue_schema import (
    CreateVenueRequest,
    CreateVenueResponse,
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
    db: Session = Depends(get_db),
):
    result = venue_service.get_all_venues(
        db=db,
        skip=skip,
        limit=limit,
    )

    return SuccessResponse(
        message="Venues list retrieved successfully",
        data=result,
    )
