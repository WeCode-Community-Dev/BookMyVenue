from datetime import datetime, time
from decimal import Decimal

from pydantic import BaseModel, Field, field_validator, model_validator


WEEKDAY_LABELS = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday",
}


class ScheduleOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    name: str | None = None
    start_time: time
    end_time: time
    price: Decimal
    is_available: bool


class ScheduleGroupOut(BaseModel):
    id: int
    name: str
    is_active: bool
    days: list[int]
    schedules: list[ScheduleOut]
    created_at: datetime
    updated_at: datetime


class ScheduleWriteIn(BaseModel):
    id: int | None = Field(None, ge=1)
    name: str | None = Field(None, max_length=100)
    start_time: time
    end_time: time
    price: Decimal = Field(ge=0, decimal_places=2)
    is_available: bool = True

    @model_validator(mode="after")
    def end_after_start(self) -> "ScheduleWriteIn":
        if self.end_time <= self.start_time:
            raise ValueError("end_time must be after start_time.")
        return self


class ScheduleGroupWriteIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    is_active: bool = True
    days: list[int] = Field(min_length=1)
    schedules: list[ScheduleWriteIn] = Field(min_length=1)

    @field_validator("days")
    @classmethod
    def days_in_range_and_unique(cls, value: list[int]) -> list[int]:
        for d in value:
            if d < 0 or d > 6:
                raise ValueError(f"Day {d} is out of range (0–6).")
        if len(value) != len(set(value)):
            raise ValueError("Duplicate days are not allowed.")
        return value
