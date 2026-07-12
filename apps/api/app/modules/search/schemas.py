from uuid import UUID

from pydantic import BaseModel

from app.modules.venue.schemas import VenueCategoryResponse


class SearchParams(BaseModel):
    q: str = ""
    city: str = ""
    venue_type: str | None = None  # slug — kept for URL backward compat
    capacity: int = 0
    instant_booking: bool = False
    # "recommended" | "price_asc" | "price_desc" | "capacity_desc"
    sort: str = "recommended"
    # Opaque keyset cursor from a previous page's `next_cursor`. None = first page.
    cursor: str | None = None
    # Offset-style page/page_size are kept for the Deep Research caller, which
    # still paginates internal_results the old way. Cursor-based callers
    # (the venue listing "Load more" flow) should leave `page` untouched and
    # pass `cursor` instead.
    page: int = 1
    page_size: int = 20


class SearchResult(BaseModel):
    id: UUID
    name: str
    city: str
    category: VenueCategoryResponse
    capacity: int
    booking_mode: str
    pricing_mode: str
    starting_price_paise: int | None = None
    display_price_min_paise: int | None = None
    display_price_max_paise: int | None = None
    cover_photo_url: str | None = None
    is_liked: bool = False
    # Match diagnostics — only populated by search_hybrid (None for plain
    # /search, /search/fts, /search/semantic). Lets a caller (e.g. Deep
    # Research's citation UI) show which signal(s) actually matched and how
    # strongly, without re-deriving it client-side.
    match_source: str | None = None  # "hybrid" | "semantic" | "keyword"
    fts_score: float | None = None
    vector_score: float | None = None
    category_boost: float | None = None
    match_score: float | None = None


class SearchResultPage(BaseModel):
    items: list[SearchResult]
    total: int
    next_cursor: str | None = None
    has_more: bool = False
