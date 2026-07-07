"""Upstash-Redis-backed rate limiting.

Fixed-window counters keyed per user/action/window. If Upstash isn't
configured, checks fail open (no limiting) — matches the fallback pattern
already used by the search indexer's job queue push.
"""
import time
from datetime import date
from uuid import UUID

from app.core.config import settings
from app.core.exceptions import RateLimitError


def _redis_client():
    from upstash_redis import Redis

    return Redis(url=settings.upstash_redis_url, token=settings.upstash_redis_token)


def _configured() -> bool:
    return bool(settings.upstash_redis_url and settings.upstash_redis_token)


def _check(key: str, limit: int, ttl_seconds: int, detail: str) -> None:
    if not _configured():
        return
    try:
        client = _redis_client()
        count = client.incr(key)
        if count == 1:
            client.expire(key, ttl_seconds)
    except RateLimitError:
        raise
    except Exception:
        # Redis unreachable — fail open rather than blocking the feature.
        return
    if count > limit:
        raise RateLimitError(detail)


def enforce_per_minute_limit(user_id: UUID, action: str) -> None:
    window = int(time.time() // 60)
    key = f"rl:{action}:min:{user_id}:{window}"
    _check(
        key,
        settings.deep_research_rate_limit_per_minute,
        ttl_seconds=60,
        detail="Too many requests — please slow down and try again shortly.",
    )


def enforce_daily_limit(user_id: UUID, action: str, limit: int) -> None:
    key = f"rl:{action}:day:{user_id}:{date.today().isoformat()}"
    _check(
        key,
        limit,
        ttl_seconds=90_000,  # 25h, covers clock drift across the day boundary
        detail=f"Daily limit of {limit} deep research requests reached — try again tomorrow.",
    )
