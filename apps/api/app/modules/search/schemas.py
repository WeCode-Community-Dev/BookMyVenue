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
