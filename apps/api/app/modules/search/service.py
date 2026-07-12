import logging
from uuid import UUID

import numpy as np
from sqlalchemy import func as sa_func
from sqlalchemy import or_, text
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.modules.search import search_metadata_cache
from app.modules.search.category_intent import (
    GROUP_CORPORATE,
    GROUP_EVENT,
    GROUP_WEDDING,
    detect_category_intents,
)
from app.modules.search.query_normalizer import normalize_query
from app.modules.search.schemas import SearchParams, SearchResult
from app.modules.venue.models import Venue, VenueCategory, VenuePhoto, VenueStatus
from app.shared.pagination import Page

logger = logging.getLogger(__name__)


def _base_query(db: Session, params: SearchParams):
    """Base approved/active venue query with city, type, and capacity filters applied."""
    query = (
        db.query(Venue)
        .options(joinedload(Venue.category))
        .filter(
            Venue.status == VenueStatus.approved,
            Venue.is_active,
            Venue.deleted_at.is_(None),
        )
    )
    if params.city:
        query = query.filter(Venue.city.ilike(f"%{params.city}%"))
    if params.venue_type:
        query = query.join(VenueCategory, Venue.category_id == VenueCategory.id).filter(
            VenueCategory.slug == params.venue_type
        )
    if params.capacity > 0:
        query = query.filter(Venue.max_capacity >= params.capacity)
    return query


def _cover_photos(db: Session, venue_ids: list) -> dict:
    if not venue_ids:
        return {}
    photos = (
        db.query(VenuePhoto)
        .filter(
            VenuePhoto.venue_id.in_(venue_ids),
            VenuePhoto.is_cover,
            VenuePhoto.deleted_at.is_(None),
        )
        .all()
    )
    return {p.venue_id: p.image_url for p in photos}


def _match_source(fts_matched: bool, vector_matched: bool) -> str:
    if fts_matched and vector_matched:
        return "hybrid"
    if vector_matched:
        return "semantic"
    return "keyword"


def _to_results(
    venues: list[Venue], cover_photos: dict, scores: dict | None = None
) -> list[SearchResult]:
    scores = scores or {}
    results = []
    for v in venues:
        starting_price = (
            v.starting_price_paise if v.pricing_mode in ("flat", "mixed") else v.hourly_rate_paise
        )
        row_scores = scores.get(v.id)
        results.append(
            SearchResult(
                id=v.id,
                name=v.name,
                city=v.city,
                category=v.category,
                capacity=v.max_capacity,
                booking_mode=v.booking_mode,
                pricing_mode=v.pricing_mode,
                starting_price_paise=starting_price,
                display_price_min_paise=v.display_price_min_paise,
                display_price_max_paise=v.display_price_max_paise,
                cover_photo_url=cover_photos.get(v.id),
                match_source=(
                    _match_source(row_scores["fts_matched"], row_scores["vector_matched"])
                    if row_scores
                    else None
                ),
                fts_score=row_scores["fts_score"] if row_scores else None,
                vector_score=row_scores["vector_score"] if row_scores else None,
                category_boost=row_scores["boost"] if row_scores else None,
                match_score=row_scores["hybrid_score"] if row_scores else None,
            )
        )
    return results


def search(db: Session, params: SearchParams) -> Page[SearchResult]:
    query = (
        db.query(Venue)
        .options(joinedload(Venue.category))
        .filter(
            Venue.status == VenueStatus.approved,
            Venue.is_active,
            Venue.deleted_at.is_(None),
        )
    )

    if params.q:
        search_term = f"%{params.q}%"
        query = query.filter(
            or_(
                Venue.name.ilike(search_term),
                Venue.description.ilike(search_term),
                Venue.city.ilike(search_term),
                Venue.state.ilike(search_term),
            )
        )

    if params.city:
        query = query.filter(Venue.city.ilike(f"%{params.city}%"))

    if params.venue_type:
        query = query.join(VenueCategory, Venue.category_id == VenueCategory.id).filter(
            VenueCategory.slug == params.venue_type
        )

    if params.capacity > 0:
        query = query.filter(Venue.max_capacity >= params.capacity)

    total_count = query.count()

    offset = (params.page - 1) * params.page_size
    venues = query.order_by(Venue.created_at.desc()).offset(offset).limit(params.page_size).all()

    covers = _cover_photos(db, [v.id for v in venues])

    return Page(
        items=_to_results(venues, covers),
        total=total_count,
        page=params.page,
        page_size=params.page_size,
    )


# ── FTS search ────────────────────────────────────────────────────────────────


def search_fts(db: Session, params: SearchParams) -> Page[SearchResult]:
    """Full-text search ranked by ts_rank. Requires search_vector to be populated."""
    query = _base_query(db, params)

    if params.q:
        ts_query = sa_func.plainto_tsquery("english", params.q)
        query = query.filter(
            Venue.search_vector.op("@@")(ts_query),
        ).order_by(sa_func.ts_rank(Venue.search_vector, ts_query).desc())
    else:
        query = query.order_by(Venue.created_at.desc())

    total_count = query.count()
    offset = (params.page - 1) * params.page_size
    venues = query.offset(offset).limit(params.page_size).all()
    covers = _cover_photos(db, [v.id for v in venues])
    return Page(
        items=_to_results(venues, covers),
        total=total_count,
        page=params.page,
        page_size=params.page_size,
    )


# ── Semantic search ───────────────────────────────────────────────────────────


def search_semantic(db: Session, params: SearchParams) -> Page[SearchResult]:
    """Vector similarity search using Jina embeddings. Requires embedding to be populated."""
    from app.modules.search.indexer import generate_query_embedding

    query = _base_query(db, params).filter(Venue.embedding.isnot(None))

    if params.q:
        try:
            query_vec = generate_query_embedding(params.q)
            query = query.order_by(Venue.embedding.op("<=>")(query_vec).asc())
        except Exception as exc:
            logger.warning(
                "search_semantic: embedding generation failed (%s), falling back to FTS",
                exc,
            )
            return search_fts(db, params)
    else:
        query = query.order_by(Venue.created_at.desc())

    total_count = query.count()
    offset = (params.page - 1) * params.page_size
    venues = query.offset(offset).limit(params.page_size).all()
    covers = _cover_photos(db, [v.id for v in venues])
    return Page(
        items=_to_results(venues, covers),
        total=total_count,
        page=params.page,
        page_size=params.page_size,
    )


# ── Hybrid search ─────────────────────────────────────────────────────────────


def _has_any_embeddings(db: Session) -> bool:
    """Cheap existence check — was `.limit(1).count()`, which still runs a
    count aggregate. `.exists()` short-circuits at the first matching row."""
    exists_query = (
        db.query(Venue.id)
        .filter(
            Venue.status == VenueStatus.approved,
            Venue.is_active,
            Venue.deleted_at.is_(None),
            Venue.embedding.isnot(None),
        )
        .exists()
    )
    return db.query(exists_query).scalar()


def _log_hybrid_diagnostics(
    db: Session,
    raw_query: str,
    normalized_q: str,
    query_vec: list[float],
    intents: dict,
) -> None:
    """Debug diagnostics comparing the FTS-only and vector-only result sets.

    Runs 3 extra queries — only call this when settings.search_diagnostics_enabled
    is on (dev/staging), not unconditionally on every production request.
    """
    try:
        vec_norm = float(np.linalg.norm(np.array(query_vec, dtype=np.float32)))

        common_where = """
            v.status = 'approved' AND v.is_active = true AND v.deleted_at IS NULL
        """

        fts_count_sql = text(f"""
            SELECT COUNT(*) FROM venues v
            WHERE {common_where}
              AND v.search_vector @@ plainto_tsquery('english', :q)
        """)
        fts_matches = db.execute(fts_count_sql, {"q": normalized_q}).scalar() or 0

        fts_top_sql = text(f"""
            SELECT v.id FROM venues v
            WHERE {common_where}
              AND v.search_vector @@ plainto_tsquery('english', :q)
            ORDER BY ts_rank(v.search_vector, plainto_tsquery('english', :q)) DESC
            LIMIT 10
        """)
        fts_top_ids = [str(r.id) for r in db.execute(fts_top_sql, {"q": normalized_q}).fetchall()]

        vec_top_sql = text(f"""
            SELECT v.id FROM venues v
            WHERE {common_where}
              AND v.embedding IS NOT NULL
            ORDER BY v.embedding <=> CAST(:qvec AS vector) ASC
            LIMIT 10
        """)
        vec_top_ids = [
            str(r.id) for r in db.execute(vec_top_sql, {"qvec": str(query_vec)}).fetchall()
        ]

        overlap = len(set(fts_top_ids) & set(vec_top_ids))

        logger.info(
            "search_hybrid diagnostics | "
            "raw_query=%r normalized_query=%r fts_matches=%d "
            "query_vec_norm=%.4f vector_threshold=%.2f "
            "fts_top10=%s vector_top10=%s overlap=%d "
            "wedding_boost=%.2f event_boost=%.2f",
            raw_query,
            normalized_q,
            fts_matches,
            vec_norm,
            settings.search_min_vector_similarity,
            fts_top_ids,
            vec_top_ids,
            overlap,
            intents.get(GROUP_WEDDING, 1.0),
            intents.get(GROUP_EVENT, 1.0),
        )
    except Exception:
        logger.exception("search_hybrid: diagnostics logging failed")


def _log_hybrid_result_scores(rows, limit: int = 20) -> None:
    """Log the FTS/vector/boost/hybrid score breakdown for top results."""
    try:
        lines = [
            f"  #{i + 1:>2} id={row.id} cat={row.category_slug or '-':<14} "
            f"fts={row.fts_score:.4f} vec={row.vector_score:.4f} "
            f"boost={row.boost:.2f} hybrid={row.hybrid_score:.4f} name={row.name!r}"
            for i, row in enumerate(rows[:limit])
        ]
        logger.info("search_hybrid result scores (top %s):\n%s", len(lines), "\n".join(lines))
    except Exception:
        logger.exception("search_hybrid: result score logging failed")


def search_hybrid(db: Session, params: SearchParams) -> Page[SearchResult]:
    """Hybrid Search using Full-Text Search + Vector Search + Category Boost"""

    if not params.q:
        return search_fts(db, params)

    raw_query = params.q
    normalized_q = normalize_query(raw_query)

    if not _has_any_embeddings(db):
        return search_fts(db, params)

    from app.modules.search.indexer import generate_query_embedding

    try:
        query_vec = generate_query_embedding(normalized_q)
    except Exception as exc:
        logger.warning("Embedding generation failed: %s", exc)
        return search_fts(db, params)

    intents = detect_category_intents(normalized_q)

    if settings.search_diagnostics_enabled:
        _log_hybrid_diagnostics(db, raw_query, normalized_q, query_vec, intents)

    # Slug lists per boost group now come from the DB-backed cache instead
    # of being hardcoded here — see search_metadata_cache.py. Passed as
    # array bind params (`= ANY(:param)`), not string-interpolated, so a
    # category added via the admin panel doesn't need a redeploy.
    wedding_slugs = search_metadata_cache.slugs_in_group(GROUP_WEDDING)
    event_slugs = search_metadata_cache.slugs_in_group(GROUP_EVENT)
    corporate_slugs = search_metadata_cache.slugs_in_group(GROUP_CORPORATE)

    base_filters = [
        "v.status = 'approved'",
        "v.is_active = true",
        "v.deleted_at IS NULL",
        """
        (
            v.search_vector @@ plainto_tsquery('english', :q)

            OR

            (
                v.embedding IS NOT NULL
                AND NOT (
                    v.search_vector @@ plainto_tsquery('english', :q)
                )
                AND (
                    1 - (
                        v.embedding <=> CAST(:qvec AS vector)
                    )
                ) >= :min_vector_score
            )
        )
        """,
    ]

    query_params = {
        "q": normalized_q,
        "qvec": str(query_vec),
        "min_vector_score": settings.search_min_vector_similarity,
        # Boost values and slug lists are now bind params rather than
        # f-string-interpolated literals: the SQL *text* is identical across
        # calls regardless of which intent was detected, so Postgres can
        # reuse a cached plan instead of re-planning every query.
        "wedding_slugs": wedding_slugs,
        "event_slugs": event_slugs,
        "corporate_slugs": corporate_slugs,
        "wedding_boost": intents.get(GROUP_WEDDING, 1.0),
        "event_boost": intents.get(GROUP_EVENT, 1.0),
        "corporate_boost": intents.get(GROUP_CORPORATE, 1.0),
        "fts_weight": settings.search_fts_weight,
        "vector_weight": settings.search_vector_weight,
    }

    if params.city:
        base_filters.append("v.city ILIKE :city")
        query_params["city"] = f"%{params.city}%"

    if params.capacity > 0:
        base_filters.append("v.max_capacity >= :capacity")
        query_params["capacity"] = params.capacity

    if params.venue_type:
        base_filters.append("vc.slug = :venue_type")
        query_params["venue_type"] = params.venue_type

    where_clause = " AND ".join(base_filters)

    query_params["limit"] = params.page_size
    query_params["offset"] = (params.page - 1) * params.page_size

    # Boost/score computed once in a CTE (was duplicated inline in both the
    # `boost` column and `hybrid_score` expression) and total count comes
    # from a window function on the same query instead of a separate
    # COUNT(*) round trip over the whole WHERE clause.
    rows_sql = text(f"""
        WITH scored AS (
            SELECT
                v.id,
                v.name,
                vc.slug AS category_slug,
                COALESCE(
                    ts_rank(v.search_vector, plainto_tsquery('english', :q)),
                    0
                ) AS fts_score,
                COALESCE(
                    1 - (v.embedding <=> CAST(:qvec AS vector)),
                    0
                ) AS vector_score,
                (
                    v.search_vector @@ plainto_tsquery('english', :q)
                ) AS fts_matched,
                (
                    v.embedding IS NOT NULL
                    AND (1 - (v.embedding <=> CAST(:qvec AS vector))) >= :min_vector_score
                ) AS vector_matched,
                CASE
                    WHEN vc.slug = ANY(:wedding_slugs) THEN :wedding_boost
                    WHEN vc.slug = ANY(:event_slugs) THEN :event_boost
                    WHEN vc.slug = ANY(:corporate_slugs) THEN :corporate_boost
                    ELSE 1.00
                END AS boost
            FROM venues v
            LEFT JOIN venue_categories vc ON vc.id = v.category_id
            WHERE {where_clause}
        )
        SELECT
            id,
            name,
            category_slug,
            fts_score,
            vector_score,
            fts_matched,
            vector_matched,
            boost,
            (:fts_weight * fts_score + :vector_weight * vector_score) * boost AS hybrid_score,
            COUNT(*) OVER() AS total_count
        FROM scored
        ORDER BY hybrid_score DESC
        LIMIT :limit
        OFFSET :offset
    """)

    rows = db.execute(rows_sql, query_params).fetchall()

    if settings.search_diagnostics_enabled:
        _log_hybrid_result_scores(rows)

    if not rows:
        return Page(items=[], total=0, page=params.page, page_size=params.page_size)

    total = rows[0].total_count
    venue_ids: list[UUID] = [row.id for row in rows]
    scores = {
        row.id: {
            "fts_score": row.fts_score,
            "vector_score": row.vector_score,
            "fts_matched": row.fts_matched,
            "vector_matched": row.vector_matched,
            "boost": row.boost,
            "hybrid_score": row.hybrid_score,
        }
        for row in rows
    }

    # Fetch full venue objects with relationships
    venues_by_id = {
        venue.id: venue
        for venue in (
            db.query(Venue)
            .options(joinedload(Venue.category))
            .filter(Venue.id.in_(venue_ids))
            .all()
        )
    }

    venues = [venues_by_id[vid] for vid in venue_ids if vid in venues_by_id]
    covers = _cover_photos(db, venue_ids)

    return Page(
        items=_to_results(venues, covers, scores),
        total=total,
        page=params.page,
        page_size=params.page_size,
    )
