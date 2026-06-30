from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.modules.bookings.model import BookingStatus


class BookingCreate(BaseModel):
    venue_id: int
    start_at: datetime
    end_at: datetime

    @model_validator(mode="after")
    def _check_range(self):
        if self.end_at <= self.start_at:
            raise ValueError("end_at must be after start_at")
        return self


class BookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    venue_id: int
    start_at: datetime
    end_at: datetime
    status: BookingStatus
    total_price: float
    created_at: datetime
    venue_name: Optional[str] = None


class BookingDecision(BaseModel):
    status: BookingStatus = Field(description="confirmed or declined")
