import logging
from typing import Any
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{place_id}"
TEXT_SEARCH_FIELD_MASK = "places.id,places.displayName,places.formattedAddress,places.location,places.types"
DETAILS_FIELD_MASK = "id,displayName,formattedAddress,location,internationalPhoneNumber,websiteUri,rating,userRatingCount,types"


class ExternalSourceError(Exception):
    pass


class GooglePlacesSource:
    def __init__(self, api_key: str | None = None, timeout: float = 8.0):
        self.api_key = api_key or settings.google_places_api_key
        self.timeout = timeout

    def text_search(self, query: str, latitude: float, longitude: float, radius_meters: int = 15000, max_results: int = 5) -> list[dict[str, Any]]:
        payload = {"textQuery": query, "maxResultCount": max_results,
                   "locationBias": {"circle": {"center": {"latitude": latitude, "longitude": longitude}, "radius": radius_meters}}}
        headers = {"Content-Type": "application/json", "X-Goog-Api-Key": self.api_key, "X-Goog-FieldMask": TEXT_SEARCH_FIELD_MASK}
        try:
            resp = httpx.post(PLACES_TEXT_SEARCH_URL, json=payload, headers=headers, timeout=self.timeout)
            resp.raise_for_status()
        except httpx.HTTPError as e:
            raise ExternalSourceError(f"text_search failed: {e}") from e
        return resp.json().get("places", [])

    def place_details(self, place_id: str) -> dict[str, Any]:
        headers = {"X-Goog-Api-Key": self.api_key, "X-Goog-FieldMask": DETAILS_FIELD_MASK}
        try:
            resp = httpx.get(PLACES_DETAILS_URL.format(place_id=place_id), headers=headers, timeout=self.timeout)
            resp.raise_for_status()
        except httpx.HTTPError as e:
            raise ExternalSourceError(f"place_details failed: {e}") from e
        return resp.json()


external_source = GooglePlacesSource()
