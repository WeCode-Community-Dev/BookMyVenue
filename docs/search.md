# Search

**Status:** Shipped — verified against code, 2026-07-17

Hybrid full-text + semantic search over `venues`. This is the retrieval backbone for venue browsing (`user-web`) and for [Deep Research](./deep-research.md)'s internal result set — both call the same `search_hybrid()` function in `apps/api/app/modules/search/service.py`, so there's exactly one ranking implementation, not two.

## Three search modes

| Function | Method | When used |
|---|---|---|
| `search_fts()` | Postgres `tsvector`/`plainto_tsquery` full-text search | Fallback when no embeddings exist yet, or the hybrid query fails |
| `search_semantic()` | pgvector cosine distance (`<=>`) against Jina embeddings | Debug/comparison route, not the main listing flow |
| `search_hybrid()` | FTS + vector similarity, blended, plus a category-intent boost | The default — used by venue listing and Deep Research |

All three only ever return venues with `status = approved`, `is_active = true`, `deleted_at IS NULL` — matching the platform-wide venue visibility invariant.

## How hybrid scoring works

For a query, `search_hybrid()` runs one SQL statement that computes, per candidate venue:

```
fts_score    = ts_rank(search_vector, plainto_tsquery(query))
vector_score = 1 - (embedding <=> query_embedding)     -- cosine similarity
boost        = category-intent multiplier (wedding / event / corporate, or 1.0)
hybrid_score = (fts_weight * fts_score + vector_weight * vector_score) * boost
```

A venue matches if it satisfies the FTS query OR has vector similarity above a minimum threshold — this is a union, not an intersection, so a strong semantic match with no keyword overlap still surfaces.

- **`fts_weight`, `vector_weight`, `search_min_vector_similarity`** are admin-tunable via `platform_settings` (defaults 0.3 / 0.7 / 0.15) — changing search behavior doesn't require a deploy. See `apps/api/app/modules/admin/settings_store.py`.
- **Category-intent boost**: the query text is matched against category groups (wedding / event / corporate) via `detect_category_intents()`; matching venues in that category get their score multiplied. Boost group membership and keyword lists live in the DB (`search_metadata_cache`), not hardcoded — an admin can add a category to a boost group without a redeploy.
- **`match_source`** on each result is `hybrid` (matched both), `semantic` (vector only), or `keyword` (FTS only) — surfaced to callers (including Deep Research's query logging) for observability.
- Query embeddings are generated on the fly via **Jina AI** (`generate_query_embedding`, in `search/indexer.py`); venue embeddings are pre-computed and stored on `venues.embedding` (`vector(1024)`).

Pagination is keyset-based (opaque `cursor`, not page numbers) so results stay stable while new venues are indexed concurrently.

## Indexing

Venue create/update enqueues a `SearchIndexJob` row (table: `search_index_jobs`) via `enqueue_job()`. Two delivery paths, both active:

1. **Upstash Redis** (optional, fail-open) — the job id is pushed to a list (`search_index_jobs` key) for low-latency pickup.
2. **DB polling fallback** — if Redis isn't configured or the push fails, the in-process worker polls `search_index_jobs` directly. Every job is retried with exponential backoff (`0s, 5m, 15m, 1h, 6h`) up to 5 attempts, so a transient Jina/embedding failure self-heals.

This is the one place in the platform where Upstash Redis is actually in the request path today — it is **not** used as a general background-job queue (those jobs run via GitHub Actions cron; see [`../DEPLOY.md`](../DEPLOY.md)). Redis is also used for rate limiting and Deep Research's query cache, all fail-open by the same `core/redis.py` contract.

## Filters (all modes)

`city`, `venue_type` (category slug), `capacity`, `instant_booking` (filters to `booking_mode = INSTANT`), plus `sort` (`recommended` / `price_asc` / `price_desc` / `capacity_desc`).
