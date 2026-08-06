from django.http import JsonResponse

from notifications.services.redis_client import ping_redis


def health_check(_request):
    redis_ok = ping_redis()
    status_code = 200 if redis_ok else 503

    return JsonResponse(
        {
            "status": "ok" if redis_ok else "degraded",
            "redis": "ok" if redis_ok else "unavailable",
        },
        status=status_code,
    )
