import logging
import re
import time

import redis
from django.conf import settings
from django.http import HttpResponse, JsonResponse

from notifications.services.redis_client import get_redis_client

logger = logging.getLogger(__name__)

ALLOWED_ORIGIN_REGEX = re.compile(
    r"^https?://("
    r"localhost"
    r"|127\.0\.0\.1"
    r"|\[::1\]"
    r"|192\.168\.\d{1,3}\.\d{1,3}"
    r"|10\.\d{1,3}\.\d{1,3}\.\d{1,3}"
    r"|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}"
    r")(:\d+)?$"
)


def is_allowed_origin(origin: str) -> bool:
    if not origin:
        return False
    if origin in settings.CORS_ALLOWED_ORIGINS:
        return True
    return bool(ALLOWED_ORIGIN_REGEX.match(origin))


def get_client_ip(request) -> str:
    """Return the client IP, preferring the first X-Forwarded-For hop."""
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip() or "unknown"
    return request.META.get("REMOTE_ADDR") or "unknown"


class CorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        origin = request.headers.get("Origin", "")

        if request.method == "OPTIONS" and is_allowed_origin(origin):
            response = HttpResponse(status=200)
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = (
                "Authorization, Content-Type, Accept, Origin, X-Requested-With"
            )
            response["Access-Control-Max-Age"] = "86400"
            return response

        response = self.get_response(request)

        if is_allowed_origin(origin):
            response["Access-Control-Allow-Origin"] = origin
            response["Access-Control-Allow-Credentials"] = "true"
            response["Vary"] = "Origin"

        return response


class RateLimitMiddleware:
    """
    Global fixed-window rate limiter backed by Redis INCR / EXPIRE.

    Key format: rate_limit:<identifier>:<window_id>
    where window_id = int(time.time() // WINDOW_SECONDS).
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        limit = int(settings.RATE_LIMIT_REQUESTS)
        window_seconds = int(settings.RATE_LIMIT_WINDOW_SECONDS)
        if limit <= 0 or window_seconds <= 0:
            return self.get_response(request)

        identifier = get_client_ip(request)
        window_id = int(time.time() // window_seconds)
        key = f"rate_limit:{identifier}:{window_id}"

        try:
            client = get_redis_client()
            count = client.incr(key)
            if count == 1:
                client.expire(key, window_seconds)
        except redis.RedisError:
            # Fail open: do not block traffic if Redis is unavailable.
            logger.warning(
                "Redis unavailable during rate limiting; allowing request.",
                exc_info=True,
            )
            return self.get_response(request)

        if count > limit:
            return JsonResponse(
                {"detail": "Rate limit exceeded"},
                status=429,
            )

        return self.get_response(request)
