from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class VenueReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    title: str | None = Field(None, max_length=150)
    review: str | None = Field(None, min_length=1)


class VenueReviewUpdate(BaseModel):
    rating: int | None = Field(None, ge=1, le=5)
    title: str | None = Field(None, max_length=150)
    review: str | None = Field(None, min_length=1)


class VenueReviewItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    rating_id: UUID
    user_id: int
    rating: int
    review_id: UUID | None = None
    title: str | None = None
    review: str | None = None
    is_edited: bool | None = None
    created_at: datetime


class VenueReviewsResponse(BaseModel):
    venue_id: int
    average_rating: float | None
    total_count: int
    items: list[VenueReviewItem]
