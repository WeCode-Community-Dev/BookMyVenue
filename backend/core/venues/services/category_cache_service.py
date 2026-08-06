import json
import logging

import redis
from django.conf import settings

from notifications.services.redis_client import get_redis_client
from venues.models import VenueCategory
from venues.serializers import VenueCategorySerializer

logger = logging.getLogger(__name__)


class CategoryCacheService:
    CACHE_KEY = "bookmyvenue:venue-categories:active"

    @classmethod
    def _client(cls) -> redis.Redis:
        return get_redis_client()

    @classmethod
    def _load_from_db(cls) -> list[dict]:
        categories = VenueCategory.objects.filter(is_active=True).order_by("name")
        return [dict(item) for item in VenueCategorySerializer(categories, many=True).data]

    @classmethod
    def _store(cls, client: redis.Redis, payload: list[dict]) -> None:
        ttl = settings.VENUE_CATEGORY_CACHE_TTL_SECONDS
        client.setex(cls.CACHE_KEY, ttl, json.dumps(payload))

    @classmethod
    def get_active_categories(cls) -> list[dict]:
        try:
            client = cls._client()
            cached = client.get(cls.CACHE_KEY)
            if cached is not None:
                try:
                    return json.loads(cached)
                except (TypeError, json.JSONDecodeError):
                    logger.warning(
                        "Invalid venue category cache payload; refreshing from DB.",
                    )
        except redis.RedisError:
            logger.warning(
                "Redis unavailable while reading venue categories; falling back to DB.",
                exc_info=True,
            )
            return cls._load_from_db()

        payload = cls._load_from_db()

        try:
            cls._store(client, payload)
        except redis.RedisError:
            logger.warning(
                "Redis unavailable while writing venue categories cache.",
                exc_info=True,
            )

        return payload

    @classmethod
    def invalidate(cls) -> None:
        try:
            cls._client().delete(cls.CACHE_KEY)
        except redis.RedisError:
            logger.warning(
                "Redis unavailable while invalidating venue categories cache.",
                exc_info=True,
            )
