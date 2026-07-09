"""Generic Upstash-backed durable job queue mechanics, shared by every async
job pipeline in this app (search indexing, invoice generation, ...).

Each pipeline still owns its own DB model, its own SQLAlchemy queries for
"pending" and "failed" rows, and its own processing function — this module
only factors out the two bits that were duplicated identically across them:
dequeuing from the Upstash fast-path (with DB-polling as the fallback), and
deciding whether a failed row's backoff window has elapsed yet.
"""
import logging
from datetime import datetime, timezone, timedelta

from app.core import redis as redis_client

logger = logging.getLogger(__name__)

# Attempt 0 -> immediate, 1 -> 5 min, 2 -> 15 min, 3 -> 1 hr, 4 -> 6 hr
DEFAULT_BACKOFF_SECONDS = [0, 300, 900, 3600, 21600]


def dequeue_from_redis(queue_key: str, limit: int) -> list[str]:
    """Pop up to `limit` ids from an Upstash list queue.

    Returns [] if Upstash isn't configured or is unreachable — the caller
    falls back to polling the DB directly (see is_backoff_eligible).
    """
    if not redis_client.is_configured():
        return []

    try:
        redis = redis_client.get_redis()
        ids = []
        for _ in range(limit):
            item = redis.rpop(queue_key)
            if not item:
                break
            ids.append(item)
        return ids
    except Exception as exc:
        logger.warning("Redis unavailable: %s", exc)
        return []


def is_backoff_eligible(
    created_at: datetime, attempts: int, backoff_seconds: list[int] = DEFAULT_BACKOFF_SECONDS,
) -> bool:
    """Whether a failed row created at `created_at` with `attempts` prior
    tries has waited long enough per the backoff schedule to retry now."""
    delay = backoff_seconds[min(attempts, len(backoff_seconds) - 1)]
    eligible_at = created_at.replace(tzinfo=timezone.utc) + timedelta(seconds=delay)
    return datetime.now(timezone.utc) >= eligible_at
