from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    """Input schema for creating a review."""

    rating: int = Field(ge=1, le=5, description="Rating from 1 to 5")
    title: str | None = Field(
        None, max_length=255, description="Optional review title"
    )
    comment: str = Field(
        min_length=1, max_length=5000, description="Required review comment"
    )


class ReviewUpdate(BaseModel):
    """Input schema for updating a review."""

    rating: int | None = Field(None, ge=1, le=5)
    title: str | None = Field(None, max_length=255)
    comment: str | None = Field(None, min_length=1, max_length=5000)


class ReviewResponse(BaseModel):
    """Single review response."""

    id: UUID
    venue_id: UUID
    booking_id: UUID
    user_id: UUID
    rating: int
    title: str | None
    comment: str
    is_hidden: bool
    created_at: datetime
    updated_at: datetime

    # Author info (denormalized)
    user_name: str | None = None
    user_email: str | None = None

    # Hide info
    hidden_reason: str | None = None
    hidden_by: UUID | None = None
    hidden_at: datetime | None = None

    class Config:
        from_attributes = True


class ReviewListResponse(BaseModel):
    """Paginated list of reviews."""

    items: list[ReviewResponse]
    total: int
    page: int
    per_page: int


class ReviewSummaryResponse(BaseModel):
    """Rating statistics for a venue."""

    average_rating: float
    total_reviews: int
    rating_distribution: dict[str, int]  # Keys are "1" through "5"


class EligibleBookingsResponse(BaseModel):
    """List of booking IDs eligible for review at a venue."""

    booking_ids: list[UUID]


class AdminReviewActionRequest(BaseModel):
    """Input for admin actions (hide/restore)."""

    hidden_reason: str | None = Field(
        None, max_length=255, description="Reason for hiding review"
    )
