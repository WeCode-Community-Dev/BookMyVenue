import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class VenueRatingClient:
    """HTTP client for backend internal venue rating updates."""

    def __init__(self) -> None:
        self.base_url = settings.BACKEND_BASE_URL.rstrip("/")
        self.api_key = settings.INTERNAL_API_KEY
        self.timeout = settings.BACKEND_HTTP_TIMEOUT

    async def update_venue_rating(
        self,
        venue_id: int,
        *,
        average_rating: float,
        review_count: int,
    ) -> None:
        """
        Push cached rating stats to the backend.

        Failures are logged and swallowed so review mutations stay successful
        when the backend is temporarily unavailable.
        """
        if not self.api_key:
            logger.warning(
                "Skipping venue rating sync for venue_id=%s: INTERNAL_API_KEY is not set",
                venue_id,
            )
            return

        url = f"{self.base_url}/internal/venues/{venue_id}/rating"
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {
            "average_rating": average_rating,
            "review_count": review_count,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, json=payload, headers=headers)
                response.raise_for_status()
        except httpx.TimeoutException:
            logger.warning(
                "Timed out syncing rating for venue_id=%s to backend (%s)",
                venue_id,
                url,
            )
        except httpx.HTTPStatusError as exc:
            logger.warning(
                "Backend rejected rating sync for venue_id=%s: status=%s body=%s",
                venue_id,
                exc.response.status_code,
                exc.response.text,
            )
        except httpx.HTTPError as exc:
            logger.warning(
                "HTTP error syncing rating for venue_id=%s to backend: %s",
                venue_id,
                exc,
            )
        except Exception:
            logger.exception(
                "Unexpected error syncing rating for venue_id=%s to backend",
                venue_id,
            )
