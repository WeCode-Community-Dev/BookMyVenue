from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.modules.search.schemas import SearchResult
from app.shared.pagination import Page


class QueryUnderstanding(BaseModel):
    intent: str
    city: Optional[str] = None
    venue_type: Optional[str] = None
    capacity: Optional[int] = None
    budget_hint: Optional[str] = None
    date_hint: Optional[str] = None
    required_amenities: list[str] = []
    special_requirements: list[str] = []


class DeepResearchSearchRequest(BaseModel):
    query: str
    page: int = 1
    page_size: int = 20


class DeepResearchSearchResponse(BaseModel):
    query_id: UUID
    understanding: QueryUnderstanding
    internal_results: Page[SearchResult]
