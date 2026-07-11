"""Jina AI embeddings client.

This module is the only place that knows about Jina's API URL, auth headers,
request/response shape, retry policy, and task-type strings. Callers (e.g.
app.modules.search.indexer) should only ever import embed_passage /
embed_query / embed_texts from here — they should never need to know this
is Jina, or what the HTTP contract looks like.
"""

import logging
import time
from enum import StrEnum

import httpx
import numpy as np

from app.core.config import settings

logger = logging.getLogger(__name__)

_EMBEDDINGS_URL = "https://api.jina.ai/v1/embeddings"

# Retry policy for transient failures (network errors, 5xx, 429).
_MAX_RETRIES = 3
_RETRY_BACKOFF_SECONDS = [1, 3, 8]

# Jina caps input array size per request; batch larger inputs to stay under it.
_MAX_BATCH_SIZE = 64


class EmbeddingTask(StrEnum):
    """Jina task-type strings. Passage = documents being indexed, query = search input."""

    PASSAGE = "retrieval.passage"
    QUERY = "retrieval.query"


def _normalize(vector: list[float]) -> list[float]:
    """L2-normalize an embedding vector — critical for cosine/dot-product search quality."""
    arr = np.array(vector, dtype=np.float32)
    norm = np.linalg.norm(arr)
    if norm > 0:
        arr = arr / norm
    return arr.tolist()


def _is_retryable(exc: httpx.HTTPStatusError) -> bool:
    status = exc.response.status_code
    return status == 429 or status >= 500


def _post_with_retries(payload: dict) -> dict:
    if not settings.jina_api_key:
        # An empty key produces a malformed `Authorization: Bearer ` header,
        # which httpx rejects locally (never reaches the network) — retrying
        # that a further 3 times with backoff just delays every caller for no
        # chance of success. Fail immediately instead.
        raise RuntimeError("JINA_API_KEY is not configured — cannot call Jina embeddings API")

    last_exc: Exception | None = None
    for attempt in range(_MAX_RETRIES + 1):
        try:
            response = httpx.post(
                _EMBEDDINGS_URL,
                headers={
                    "Authorization": f"Bearer {settings.jina_api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as exc:
            last_exc = exc
            if not _is_retryable(exc):
                # 4xx (bad request, bad key, etc.) — retrying won't help.
                raise
        except httpx.TransportError as exc:
            last_exc = exc

        if attempt < _MAX_RETRIES:
            delay = _RETRY_BACKOFF_SECONDS[attempt]
            logger.warning(
                "jina_embeddings: attempt %s/%s failed (%s), retrying in %ss",
                attempt + 1,
                _MAX_RETRIES + 1,
                last_exc,
                delay,
            )
            time.sleep(delay)

    logger.error("jina_embeddings: all %s attempts failed (%s)", _MAX_RETRIES + 1, last_exc)
    raise last_exc


def _chunk(items: list[str], size: int) -> list[list[str]]:
    return [items[i : i + size] for i in range(0, len(items), size)]


def embed_texts(texts: list[str], task: EmbeddingTask = EmbeddingTask.PASSAGE) -> list[list[float]]:
    """Embed a batch of texts, batching internally if needed. Returns L2-normalized
    vectors in the same order as the input."""
    if not texts:
        return []

    all_embeddings: list[list[float]] = []
    for batch in _chunk(texts, _MAX_BATCH_SIZE):
        data = _post_with_retries(
            {
                "model": settings.jina_embedding_model,
                "input": batch,
                "task": task.value,
            }
        )
        # Jina returns results tagged with their input index; sort defensively
        # in case the API doesn't guarantee response order matches request order.
        ordered = sorted(data["data"], key=lambda item: item.get("index", 0))
        all_embeddings.extend(_normalize(item["embedding"]) for item in ordered)

    return all_embeddings


def embed_text(text_input: str, task: EmbeddingTask = EmbeddingTask.PASSAGE) -> list[float]:
    """Embed a single text; convenience wrapper around embed_texts."""
    return embed_texts([text_input], task=task)[0]


def embed_passage(text_input: str) -> list[float]:
    """Embed a document being indexed (e.g. a venue's search document)."""
    return embed_text(text_input, task=EmbeddingTask.PASSAGE)


def embed_passages(texts: list[str]) -> list[list[float]]:
    """Embed a batch of documents being indexed."""
    return embed_texts(texts, task=EmbeddingTask.PASSAGE)


def embed_query(query: str) -> list[float]:
    """Embed a user's search query."""
    return embed_text(query, task=EmbeddingTask.QUERY)
