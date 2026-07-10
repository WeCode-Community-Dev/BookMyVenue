"""Groq chat-completions client (OpenAI-compatible API).

This module is the only place that knows about Groq's base URL, auth header,
and request/response shape. Callers (e.g.
app.modules.deep_research.query_understanding) should only ever import
chat_completion from here — they should never need to know this is Groq, or
what the HTTP contract looks like. Mirrors the retry/backoff shape of
app.infrastructure.embeddings.jina.
"""

import logging
import time

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

_MAX_RETRIES = 2
_RETRY_BACKOFF_SECONDS = [1, 3]


def _is_retryable(exc: httpx.HTTPStatusError) -> bool:
    status = exc.response.status_code
    return status == 429 or status >= 500


def chat_completion(messages: list[dict[str, str]], temperature: float = 0.0) -> str:
    """Send a chat-completions request to Groq, returning the assistant
    message content. Raises on non-retryable errors (bad key, bad request)
    and after exhausting retries on transient failures."""
    if not settings.groq_api_key:
        # An empty key produces a malformed `Authorization: Bearer ` header,
        # which httpx rejects locally before ever reaching the network —
        # retrying that is guaranteed to fail again. Fail fast instead.
        raise RuntimeError("GROQ_API_KEY is not configured — cannot call Groq")

    payload = {
        "model": settings.groq_model,
        "messages": messages,
        "temperature": temperature,
    }

    last_exc: Exception | None = None
    for attempt in range(_MAX_RETRIES + 1):
        try:
            response = httpx.post(
                f"{settings.groq_base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.groq_api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except httpx.HTTPStatusError as exc:
            last_exc = exc
            if not _is_retryable(exc):
                raise
        except httpx.TransportError as exc:
            last_exc = exc

        if attempt < _MAX_RETRIES:
            delay = _RETRY_BACKOFF_SECONDS[attempt]
            logger.warning(
                "groq_chat_completion: attempt %s/%s failed (%s), retrying in %ss",
                attempt + 1,
                _MAX_RETRIES + 1,
                last_exc,
                delay,
            )
            time.sleep(delay)

    logger.error("groq_chat_completion: all %s attempts failed (%s)", _MAX_RETRIES + 1, last_exc)
    raise last_exc
