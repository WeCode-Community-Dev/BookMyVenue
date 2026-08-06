from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.dependencies.auth import get_current_user_id
from app.schemas.review import (
    VenueReviewCreate,
    VenueReviewItem,
    VenueReviewUpdate,
    VenueReviewsResponse,
)
from app.services.review import ReviewService

router = APIRouter(prefix="/venues", tags=["Reviews"])


@router.get("/{venue_id}/reviews", response_model=VenueReviewsResponse)
async def list_venue_reviews(
    venue_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> VenueReviewsResponse:
    """List ratings and reviews for a venue."""
    return await ReviewService(db).list_venue_reviews(
        venue_id,
        skip=skip,
        limit=limit,
    )


@router.post(
    "/{venue_id}/reviews",
    response_model=VenueReviewItem,
    status_code=status.HTTP_201_CREATED,
)
async def create_venue_review(
    venue_id: int,
    payload: VenueReviewCreate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> VenueReviewItem:
    """Create a rating (and optional review text) for a venue. Requires login."""
    return await ReviewService(db).create_venue_review(
        venue_id=venue_id,
        user_id=user_id,
        payload=payload,
    )


@router.patch(
    "/{venue_id}/reviews/{rating_id}",
    response_model=VenueReviewItem,
)
async def update_venue_review(
    venue_id: int,
    rating_id: UUID,
    payload: VenueReviewUpdate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> VenueReviewItem:
    """Update your rating and/or review text for a venue. Requires login."""
    return await ReviewService(db).update_venue_review(
        venue_id=venue_id,
        rating_id=rating_id,
        user_id=user_id,
        payload=payload,
    )


@router.delete(
    "/{venue_id}/reviews/{rating_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_venue_review(
    venue_id: int,
    rating_id: UUID,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> Response:
    """Delete your rating (and linked review) for a venue. Requires login."""
    await ReviewService(db).delete_venue_review(
        venue_id=venue_id,
        rating_id=rating_id,
        user_id=user_id,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
