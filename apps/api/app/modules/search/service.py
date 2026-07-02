import logging
from uuid import UUID

import numpy as np
from sqlalchemy import func as sa_func, text, or_
from sqlalchemy.orm import Session, joinedload

from app.modules.search.category_intent import detect_category_intents
from app.modules.search.query_normalizer import normalize_query
from app.modules.search.schemas import SearchParams, SearchResult
from app.modules.venue.models import Venue, VenueCategory, VenueStatus, VenuePhoto
from app.shared.pagination import Page

logger = logging.getLogger(__name__)


def _base_query(db: Session, params: SearchParams):
    """Base approved/active venue query with city, type, and capacity filters applied."""
    query = (
        db.query(Venue)
        .options(joinedload(Venue.category))
        .filter(
            Venue.status == VenueStatus.approved,
            Venue.is_active == True,
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
            VenuePhoto.is_cover == True,
            VenuePhoto.deleted_at.is_(None),
        )
        .all()
    )
    return {p.venue_id: p.image_url for p in photos}


def _to_results(venues: list[Venue], cover_photos: dict) -> list[SearchResult]:
    results = []
    for v in venues:
        starting_price = (
            v.starting_price_paise
            if v.pricing_mode in ("flat", "mixed")
            else v.hourly_rate_paise
        )
        results.append(
            SearchResult(
                id=v.id,
                name=v.name,
                city=v.city,
                category=v.category,
                capacity=v.max_capacity,
                pricing_mode=v.pricing_mode,
                starting_price_paise=starting_price,
                cover_photo_url=cover_photos.get(v.id),
            )
        )
    return results


def search(db: Session, params: SearchParams) -> Page[SearchResult]:
    query = (
        db.query(Venue)
        .options(joinedload(Venue.category))
        .filter(
            Venue.status == VenueStatus.approved,
            Venue.is_active == True,
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
    venues = (
        query.order_by(Venue.created_at.desc())
        .offset(offset)
        .limit(params.page_size)
        .all()
    )

    venue_ids = [v.id for v in venues]
    cover_photos = {}
    if venue_ids:
        photos = (
            db.query(VenuePhoto)
            .filter(
                VenuePhoto.venue_id.in_(venue_ids),
                VenuePhoto.is_cover == True,
                VenuePhoto.deleted_at.is_(None),
            )
            .all()
        )
        cover_photos = {p.venue_id: p.image_url for p in photos}

    results = []
    for v in venues:
        starting_price = (
            v.starting_price_paise
            if v.pricing_mode in ("flat", "mixed")
            else v.hourly_rate_paise
        )
        results.append(
            SearchResult(
                id=v.id,
                name=v.name,
                city=v.city,
                category=v.category,
                capacity=v.max_capacity,
                pricing_mode=v.pricing_mode,
                starting_price_paise=starting_price,
                cover_photo_url=cover_photos.get(v.id),
            )
        )

    return Page(
        items=results,
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


def _log_hybrid_diagnostics(
    db: Session,
    raw_query: str,
    normalized_q: str,
    query_vec: list[float],
    intents: dict,
) -> None:
    """Debug diagnostics comparing the FTS-only and vector-only result sets,
    so score-weight/vocabulary tuning can be evaluated against real queries.
    Best-effort: never let a logging failure break the actual search request.
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
        fts_top_ids = [
            str(r.id) for r in db.execute(fts_top_sql, {"q": normalized_q}).fetchall()
        ]

        vec_top_sql = text(f"""
            SELECT v.id FROM venues v
            WHERE {common_where}
              AND v.embedding IS NOT NULL
            ORDER BY v.embedding <=> CAST(:qvec AS vector) ASC
            LIMIT 10
        """)
        vec_top_ids = [
            str(r.id)
            for r in db.execute(vec_top_sql, {"qvec": str(query_vec)}).fetchall()
        ]

        overlap = len(set(fts_top_ids) & set(vec_top_ids))

        logger.info(
            "search_hybrid diagnostics | raw_query=%r normalized_query=%r "
            "fts_matches=%s query_vec_norm=%.4f fts_top10=%s vector_top10=%s overlap=%s "
            "wedding_boost=%s event_boost=%s",
            raw_query,
            normalized_q,
            fts_matches,
            vec_norm,
            fts_top_ids,
            vec_top_ids,
            overlap,
            intents["wedding_hall_banquet_hall"],
            intents["event_space_rooftop_resort_lawn"],
        )
    except Exception:
        logger.exception("search_hybrid: diagnostics logging failed")


def _log_hybrid_result_scores(rows, limit: int = 20) -> None:
    """Log the FTS/vector/boost/hybrid score breakdown for each of the top
    results actually returned, so ranking decisions are inspectable per-row.
    Best-effort: never let a logging failure break the actual search request.
    """
    try:
        lines = [
            f"  #{i+1:>2} id={row.id} cat={row.category_slug or '-':<14} "
            f"fts={row.fts_score:.4f} vec={row.vector_score:.4f} "
            f"boost={row.boost:.2f} hybrid={row.hybrid_score:.4f} name={row.name!r}"
            for i, row in enumerate(rows[:limit])
        ]
        logger.info(
            "search_hybrid result scores (top %s):\n%s", len(lines), "\n".join(lines)
        )
    except Exception:
        logger.exception("search_hybrid: result score logging failed")


def search_hybrid(db: Session, params: SearchParams) -> Page[SearchResult]:
    """Hybrid Search using Full-Text Search + Vector Search + Category Boost"""

    if not params.q:
        return search_fts(db, params)

    raw_query = params.q
    normalized_q = normalize_query(raw_query)

    has_embeddings = (
        db.query(Venue)
        .filter(
            Venue.status == VenueStatus.approved,
            Venue.is_active == True,
            Venue.deleted_at.is_(None),
            Venue.embedding.isnot(None),
        )
        .limit(1)
        .count()
        > 0
    )

    if not has_embeddings:
        return search_fts(db, params)

    from app.modules.search.indexer import generate_query_embedding

    try:
        query_vec = generate_query_embedding(normalized_q)
    except Exception as exc:
        logger.warning("Embedding generation failed: %s", exc)
        return search_fts(db, params)

    intents = detect_category_intents(normalized_q)
    _log_hybrid_diagnostics(db, raw_query, normalized_q, query_vec, intents)

    base_filters = [
        "v.status = 'approved'",
        "v.is_active = true",
        "v.deleted_at IS NULL",
        "(v.search_vector @@ plainto_tsquery('english', :q) OR v.embedding IS NOT NULL)",
    ]

    extra_params = {
        "q": normalized_q,
        "qvec": str(query_vec),
    }

    if params.city:
        base_filters.append("v.city ILIKE :city")
        extra_params["city"] = f"%{params.city}%"

    if params.capacity > 0:
        base_filters.append("v.max_capacity >= :capacity")
        extra_params["capacity"] = params.capacity

    if params.venue_type:
        base_filters.append("vc.slug = :venue_type")
        extra_params["venue_type"] = params.venue_type

    where_clause = " AND ".join(base_filters)

    # Only boost a category group if the (normalized) query actually implies
    # that intent — e.g. "rooftop party" shouldn't get a wedding-hall boost.
    boost_case = f"""
        CASE
            WHEN vc.slug IN ('wedding_hall', 'banquet_hall') THEN {intents['wedding_hall_banquet_hall']}
            WHEN vc.slug IN ('event_space', 'rooftop', 'resort', 'lawn') THEN {intents['event_space_rooftop_resort_lawn']}
            ELSE 1.00
        END
    """

    # Total count (before pagination)
    count_sql = text(f"""
        SELECT COUNT(*)
        FROM venues v
        LEFT JOIN venue_categories vc
            ON vc.id = v.category_id
        WHERE {where_clause}
    """)

    total = db.execute(count_sql, extra_params).scalar() or 0

    # Paginated hybrid search
    rows_sql = text(f"""
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
            ({boost_case}) AS boost,
            (
                (
                    0.3 * COALESCE(
                        ts_rank(
                            v.search_vector,
                            plainto_tsquery('english', :q)
                        ),
                        0
                    )
                    +
                    0.7 * COALESCE(
                        1 - (
                            v.embedding <=> CAST(:qvec AS vector)
                        ),
                        0
                    )
                )
                * {boost_case}
            ) AS hybrid_score
        FROM venues v
        LEFT JOIN venue_categories vc
            ON vc.id = v.category_id
        WHERE {where_clause}
        ORDER BY hybrid_score DESC
        LIMIT :limit
        OFFSET :offset
    """)

    extra_params["limit"] = params.page_size
    extra_params["offset"] = (params.page - 1) * params.page_size

    rows = db.execute(rows_sql, extra_params).fetchall()

    _log_hybrid_result_scores(rows)

    venue_ids: list[UUID] = [row.id for row in rows]

    if not venue_ids:
        return Page(
            items=[],
            total=0,
            page=params.page,
            page_size=params.page_size,
        )

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
        items=_to_results(venues, covers),
        total=total,
        page=params.page,
        page_size=params.page_size,
    )
