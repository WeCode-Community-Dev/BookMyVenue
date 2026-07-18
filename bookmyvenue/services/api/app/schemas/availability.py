from typing_extensions import Self
from datetime import date, time
from pydantic import BaseModel, Field, model_validator
from enum import Enum
from typing import List, Dict, Optional


class BookingTypeEnum(str, Enum):
    HOURLY = "hourly"
    DAILY = "daily"


class AvailabilitySlotCreate(BaseModel):
    start_time: time
    end_time: time


class AvailabilityCreate(BaseModel):
    venue_id: int
    date: date
    booking_type: BookingTypeEnum
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    slots: Optional[List[AvailabilitySlotCreate]] = None

    @model_validator(mode="after")
    def booking_type_validator(self) -> Self:
        if self.booking_type == BookingTypeEnum.HOURLY:
            if not self.slots:
                raise ValueError(
                    "If booking type is hourly, slots must not be empty"
                )
        if self.booking_type == BookingTypeEnum.DAILY:
            if self.slots:
                raise ValueError(
                    "If booking type is daily, slots must be empty"
                )
        return self

class AvailabilityOut(BaseModel):
    id: int
    venue_id: int
    date: date
    booking_type: BookingTypeEnum
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    is_booked: bool
    model_config = {"from_attributes": True}

class AvailabilityByDateResponse(BaseModel):
    date: date
    booking_type: BookingTypeEnum
    slots: List[AvailabilityOut]
