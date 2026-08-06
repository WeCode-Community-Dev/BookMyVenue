from functools import lru_cache

import redis
from django.conf import settings


class RedisUnavailableError(Exception):
    pass


@lru_cache(maxsize=1)
def get_redis_pool() -> redis.ConnectionPool:
    return redis.ConnectionPool.from_url(
        settings.REDIS_URL,
        decode_responses=True,
        socket_connect_timeout=settings.REDIS_SOCKET_CONNECT_TIMEOUT,
        socket_timeout=settings.REDIS_SOCKET_TIMEOUT,
        health_check_interval=30,
    )


def get_redis_client() -> redis.Redis:
    return redis.Redis(connection_pool=get_redis_pool())


def ping_redis() -> bool:
    try:
        return bool(get_redis_client().ping())
    except redis.RedisError:
        return False


def reset_redis_client() -> None:
    get_redis_pool.cache_clear()
