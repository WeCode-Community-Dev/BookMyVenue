import decimal
from typing import List, Optional

from pydantic import BaseModel

class VenueSchema(BaseModel):
    name: str
    max_capacity: str
    city: str
    district: str
    state: str
    country: str
    location_url: str
    description: str
    cancellation: bool
    cancellation_percentage: Optional[int]
    street_address: str
    minimum_slot_duration: str
    cancellation_time_limit: str
    categories: List[int] = []
    amenities: List[int] = []
    hourly_rent: int

class ImageKitVenueUrls(BaseModel):
    cover_image_url: str
    gallery_images: List[str]