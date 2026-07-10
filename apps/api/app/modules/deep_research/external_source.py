import logging
from typing import Any

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"
PLACES_DETAILS_URL = "https://places.googleapis.com/v1/places/{place_id}"


TEXT_SEARCH_FIELD_MASK = (
    "places.id,"                    # Essentials
    "places.displayName,"           # Pro — venue name
    "places.formattedAddress,"      # Pro — full address
    "places.location,"              # Pro — lat/lng for map pin
    "places.postalAddress,"         # Pro
    "places.types,"                 # Pro — category tags
    "places.photos,"                # Pro — photo reference (uploaded to Cloudinary once, cached forever)
    "places.businessStatus,"        # Pro
)

DETAILS_FIELD_MASK = (
    "formattedAddress,"
    "priceLevel,"
    "googleMapsUri,"
    "internationalPhoneNumber,"
    "websiteUri,"
    "rating,"
    "userRatingCount,"
    "regularOpeningHours,"
    "editorialSummary"
)


class ExternalSourceError(Exception):
    pass


class GooglePlacesSource:
    def __init__(self, api_key: str | None = None, timeout: float = 10.0):
        self.api_key = api_key or settings.google_places_api_key
        self.timeout = timeout

    async def text_search(
        self,
        query: str,
        latitude: float | None = None,
        longitude: float | None = None,
        radius_meters: int = 15000,
        max_results: int = 5,
    ) -> list[dict[str, Any]]:
        payload: dict[str, Any] = {
            "textQuery": query,
            "maxResultCount": max_results,
        }

        if latitude is not None and longitude is not None:
            payload["locationBias"] = {
                "circle": {
                    "center": {"latitude": latitude, "longitude": longitude},
                    "radius": radius_meters,
                }
            }

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": self.api_key,
            "X-Goog-FieldMask": TEXT_SEARCH_FIELD_MASK,
        }
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(PLACES_TEXT_SEARCH_URL, json=payload, headers=headers)
                resp.raise_for_status()
        except httpx.HTTPError as e:
            raise ExternalSourceError(f"text_search failed: {e}") from e
        return resp.json().get("places", [])

    async def place_details(self, place_id: str) -> dict[str, Any]:
        headers = {
            "X-Goog-Api-Key": self.api_key,
            "X-Goog-FieldMask": DETAILS_FIELD_MASK,
        }
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(
                    PLACES_DETAILS_URL.format(place_id=place_id), headers=headers
                )
                resp.raise_for_status()
        except httpx.HTTPError as e:
            raise ExternalSourceError(f"place_details failed: {e}") from e
        return resp.json()


external_source = GooglePlacesSource()
