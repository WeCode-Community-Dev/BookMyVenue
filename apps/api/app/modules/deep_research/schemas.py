from typing import Optional

from pydantic import BaseModel


class QueryUnderstandingRequest(BaseModel):
    query: str


class QueryUnderstanding(BaseModel):
    intent: str
    city: Optional[str] = None
    venue_type: Optional[str] = None
    capacity: Optional[int] = None
    budget_hint: Optional[str] = None
    date_hint: Optional[str] = None
    required_amenities: list[str] = []
    special_requirements: list[str] = []
