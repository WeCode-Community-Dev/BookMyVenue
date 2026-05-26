import redis
from app.core.config import settings

# Initialize production-ready Redis client.
# In container environments managed by Docker Compose, settings.REDIS_URL
# is automatically injected pointing to the 'redis' dependency container service.
if settings.REDIS_URL:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
else:
    # Safe startup placeholder for non-production/test environments
    redis_client = None
