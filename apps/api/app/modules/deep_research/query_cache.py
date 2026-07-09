"""Upstash-Redis-backed caching for the two expensive, externally-billed
calls in the Deep Research pipeline: Groq query understanding and Google
Places text search. Many users type the same/near-same query, so caching on
normalized query text avoids re-paying for both on every repeat.

Same fail-open pattern as app.core.rate_limit — if Upstash isn't configured
or is unreachable, callers just get a cache miss and run the real call.
"""
import hashlib
import json
import logging

from app.core import redis as redis_client
from app.modules.deep_research.schemas import QueryUnderstanding

logger = logging.getLogger(__name__)

UNDERSTANDING_TTL_SECONDS = 3600       # 1h — query phrasing varies a lot, keep it short
EXTERNAL_RESULTS_TTL_SECONDS = 21600   # 6h — Places listings barely change; this is the billed call


def _normalize(text: str) -> str:
    return " ".join(text.strip().lower().split())


def _key(prefix: str, text: str) -> str:
    digest = hashlib.sha256(_normalize(text).encode("utf-8")).hexdigest()[:32]
    return f"dr:{prefix}:{digest}"


def get_understanding(query: str) -> QueryUnderstanding | None:
    if not redis_client.is_configured():
        return None
    try:
        raw = redis_client.get_redis().get(_key("qu", query))
        if not raw:
            return None
        return QueryUnderstanding(**json.loads(raw))
    except Exception:
        logger.warning("query_cache.get_understanding failed for query=%r", query, exc_info=True)
        return None


def set_understanding(query: str, breakdown: QueryUnderstanding) -> None:
    if not redis_client.is_configured():
        return
    try:
        redis_client.get_redis().set(
            _key("qu", query), json.dumps(breakdown.model_dump()), ex=UNDERSTANDING_TTL_SECONDS
        )
    except Exception:
        logger.warning("query_cache.set_understanding failed for query=%r", query, exc_info=True)


def get_external_results(query_text: str) -> list[dict] | None:
    if not redis_client.is_configured():
        return None
    try:
        raw = redis_client.get_redis().get(_key("ext", query_text))
        if not raw:
            return None
        return json.loads(raw)
    except Exception:
        logger.warning("query_cache.get_external_results failed for query_text=%r", query_text, exc_info=True)
        return None


def set_external_results(query_text: str, results: list[dict]) -> None:
    if not redis_client.is_configured():
        return
    try:
        redis_client.get_redis().set(
            _key("ext", query_text), json.dumps(results), ex=EXTERNAL_RESULTS_TTL_SECONDS
        )
    except Exception:
        logger.warning("query_cache.set_external_results failed for query_text=%r", query_text, exc_info=True)
