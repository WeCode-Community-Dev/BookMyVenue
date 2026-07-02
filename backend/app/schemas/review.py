from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ReviewCreate(BaseModel):
    venue_id: int
    booking_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    venue_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    reviewer_name: str
    venue_name: str
    event_type: Optional[str] = None

    model_config = {"from_attributes": True}