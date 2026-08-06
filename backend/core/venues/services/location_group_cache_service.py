import json
import logging

import redis
from django.conf import settings
from django.db.models import Prefetch

from notifications.services.redis_client import get_redis_client
from venues.models import City, District
from venues.serializers import DistrictCityGroupSerializer

logger = logging.getLogger(__name__)


class LocationGroupCacheService:
    CACHE_KEY = "bookmyvenue:venue-location-groups"

    @classmethod
    def _client(cls) -> redis.Redis:
        return get_redis_client()

    @classmethod
    def _load_from_db(cls) -> list[dict]:
        city_queryset = City.objects.order_by("name")
        districts = (
            District.objects.filter(cities__isnull=False)
            .prefetch_related(Prefetch("cities", queryset=city_queryset))
            .order_by("name")
            .distinct()
        )
        # Round-trip through JSON so nested ReturnDict/ReturnList become plain data.
        return json.loads(
            json.dumps(DistrictCityGroupSerializer(districts, many=True).data),
        )

    @classmethod
    def _store(cls, client: redis.Redis, payload: list[dict]) -> None:
        ttl = settings.VENUE_LOCATION_GROUP_CACHE_TTL_SECONDS
        client.setex(cls.CACHE_KEY, ttl, json.dumps(payload))

    @classmethod
    def get_location_groups(cls) -> list[dict]:
        try:
            client = cls._client()
            cached = client.get(cls.CACHE_KEY)
            if cached is not None:
                try:
                    return json.loads(cached)
                except (TypeError, json.JSONDecodeError):
                    logger.warning(
                        "Invalid venue location groups cache payload; "
                        "refreshing from DB.",
                    )
        except redis.RedisError:
            logger.warning(
                "Redis unavailable while reading venue location groups; "
                "falling back to DB.",
                exc_info=True,
            )
            return cls._load_from_db()

        payload = cls._load_from_db()

        try:
            cls._store(client, payload)
        except redis.RedisError:
            logger.warning(
                "Redis unavailable while writing venue location groups cache.",
                exc_info=True,
            )

        return payload

    @classmethod
    def invalidate(cls) -> None:
        try:
            cls._client().delete(cls.CACHE_KEY)
        except redis.RedisError:
            logger.warning(
                "Redis unavailable while invalidating venue location groups cache.",
                exc_info=True,
            )
