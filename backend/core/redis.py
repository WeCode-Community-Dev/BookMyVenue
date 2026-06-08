import redis.asyncio as redis
from typing import AsyncIterator
from core.config import settings

# Global redis connection pool
redis_client = None


async def init_redis_pool() -> None:
    """Initialize the Redis connection pool."""
    global redis_client
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)


async def close_redis_pool() -> None:
    """Close the Redis connection pool."""
    global redis_client
    if redis_client:
        await redis_client.aclose()


async def get_redis() -> AsyncIterator[redis.Redis]:
    """
    Dependency function to yield the Redis client.
    """
    if redis_client is None:
        raise RuntimeError("Redis pool is not initialized")
    yield redis_client
