"""Used by rate limiting, the search index job queue, and Deep Research
query caching.

Upstash is optional infra: every caller must treat it as fail-open (check
is_configured()/catch exceptions) rather than assume it's always reachable.
"""

from app.core.config import settings


def is_configured() -> bool:
    return bool(settings.upstash_redis_url and settings.upstash_redis_token)


def get_redis():
    from upstash_redis import Redis

    return Redis(url=settings.upstash_redis_url, token=settings.upstash_redis_token)
