from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ReviewCreate(BaseModel):
    venue_id: int
    booking_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
    
class ReplyCreate(BaseModel):
    reply_text: str = Field(..., min_length=1, max_length=1000)


class ReviewOut(BaseModel):
    id: int
    venue_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    reviewer_name: str
    venue_name: str
    event_type: Optional[str] = None
    owner_reply: Optional[str] = None
    replied_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PublicReviewOut(BaseModel):
    id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    reviewer_name: str
    event_type: Optional[str] = None
    owner_reply: Optional[str] = None
    replied_at: Optional[datetime] = None


class VenueReviewsOut(BaseModel):
    reviews: list[PublicReviewOut]
    total_reviews: int
    average_rating: float
    rating_distribution: dict[str, int]