from datetime import datetime
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


# ── Admin observability ────────────────────────────────────────────────────────


class DeepResearchTopResult(BaseModel):
    id: str
    name: str
    match_source: Optional[str] = None
    match_score: Optional[float] = None


class DeepResearchQuerySummary(BaseModel):
    model_config = {"from_attributes": True}

    id: UUID
    user_id: UUID
    query_text: str
    city_filter: Optional[str] = None
    result_count: int
    avg_match_score: Optional[float] = None
    created_at: datetime


class DeepResearchQueryDetail(DeepResearchQuerySummary):
    understanding_json: Optional[dict] = None
    top_results_json: Optional[list[DeepResearchTopResult]] = None


class DeepResearchQueryListResponse(BaseModel):
    items: list[DeepResearchQuerySummary]
    total: int
    page: int
    page_size: int


class DeepResearchStatsResponse(BaseModel):
    labels: list[str]
    query_counts: list[int]
    avg_match_scores: list[Optional[float]]
    total_queries: int
    avg_result_count: float
    avg_match_score_overall: Optional[float] = None
