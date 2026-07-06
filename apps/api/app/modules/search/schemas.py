from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from app.modules.venue.schemas import VenueCategoryResponse


class SearchParams(BaseModel):
    q: str = ""
    city: str = ""
    venue_type: Optional[str] = None  # slug — kept for URL backward compat
    capacity: int = 0
    page: int = 1
    page_size: int = 20


class SearchResult(BaseModel):
    id: UUID
    name: str
    city: str
    category: VenueCategoryResponse
    capacity: int
    pricing_mode: str
    starting_price_paise: Optional[int] = None
    display_price_min_paise: Optional[int] = None
    display_price_max_paise: Optional[int] = None
    cover_photo_url: Optional[str] = None
    # Match diagnostics — only populated by search_hybrid (None for plain
    # /search, /search/fts, /search/semantic). Lets a caller (e.g. Deep
    # Research's citation UI) show which signal(s) actually matched and how
    # strongly, without re-deriving it client-side.
    match_source: Optional[str] = None  # "hybrid" | "semantic" | "keyword"
    fts_score: Optional[float] = None
    vector_score: Optional[float] = None
    category_boost: Optional[float] = None
    match_score: Optional[float] = None
