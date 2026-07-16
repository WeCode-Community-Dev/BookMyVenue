"""Generic Redis cache-aside helpers, mirroring the fail-open pattern already
used by app.modules.admin.settings_store and app.core.rate_limit. Redis is
optional infra — every function fails open (returns None / no-ops silently)
rather than raising, so a cache outage never breaks the underlying feature.

Invalidation is delete-only (no write-through), same reasoning as
settings_store: callers delete the affected key(s) right after their own
db.commit() succeeds, so a rolled-back transaction can never leave a
stale-but-wrong value cached from a write that never happened.
"""

import logging

from app.core import redis as redis_client

logger = logging.getLogger(__name__)


def cache_get(key: str) -> str | None:
    if not redis_client.is_configured():
        return None
    try:
        return redis_client.get_redis().get(key)
    except Exception:
        logger.warning("cache_get failed for %s", key, exc_info=True)
        return None


def cache_set(key: str, value: str, ttl_seconds: int) -> None:
    if not redis_client.is_configured():
        return
    try:
        redis_client.get_redis().set(key, value, ex=ttl_seconds)
    except Exception:
        logger.warning("cache_set failed for %s", key, exc_info=True)


def cache_delete(*keys: str) -> None:
    if not keys or not redis_client.is_configured():
        return
    try:
        redis_client.get_redis().delete(*keys)
    except Exception:
        logger.warning("cache_delete failed for %s", keys, exc_info=True)
