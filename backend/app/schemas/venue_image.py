from typing import Optional

from pydantic import BaseModel, field_validator, model_validator

MAX_VENUE_IMAGES = 10


class VenueImageOut(BaseModel):
    id: int
    url: str
    sort_order: int
    is_cover: bool

    model_config = {"from_attributes": True}


class VenueImageCreate(BaseModel):
    url: Optional[str] = None
    urls: Optional[list[str]] = None

    @model_validator(mode="after")
    def require_at_least_one_url(self):
        collected = [u.strip() for u in (self.urls or []) if u and u.strip()]
        if self.url and self.url.strip():
            collected.insert(0, self.url.strip())
        if not collected:
            raise ValueError("Provide at least one image url")
        if len(collected) > MAX_VENUE_IMAGES:
            raise ValueError(f"You can upload at most {MAX_VENUE_IMAGES} images at a time")
        self.urls = collected
        self.url = None
        return self

    def url_list(self) -> list[str]:
        return self.urls or []


class VenueImageUpdate(BaseModel):
    is_cover: Optional[bool] = None
    sort_order: Optional[int] = None

    @field_validator("sort_order")
    @classmethod
    def non_negative_sort_order(cls, v):
        if v is not None and v < 0:
            raise ValueError("sort_order cannot be negative")
        return v

    @model_validator(mode="after")
    def require_a_change(self):
        if self.is_cover is None and self.sort_order is None:
            raise ValueError("Provide is_cover or sort_order")
        return self
