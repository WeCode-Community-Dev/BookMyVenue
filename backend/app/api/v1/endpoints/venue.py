from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from app.schema.base_schema import SuccessResponse
from app.schema.venue_schema import CreateVenueRequest, VenueResponse
from app.service.venue_service import venue_service
from app.config.database import get_db
from app.config.dependencies import get_current_user
from app.model.user import User

"""
1. Create a new venue
2. List all venue to admin
3. Admin approve/reject venue
4. List approved venue to user
5. Delete venue by venue owner
6. update venue details by venue owner -> goes to approval status pending
"""


router = APIRouter()


@router.post(
    "create",
    response_model=SuccessResponse[VenueResponse],
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
