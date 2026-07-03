import logging
from uuid import UUID

from sqlalchemy import func as sa_func, text, or_
from sqlalchemy.orm import Session, joinedload

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
    photos = db.query(VenuePhoto).filter(
        VenuePhoto.venue_id.in_(venue_ids),
        VenuePhoto.is_cover == True,
        VenuePhoto.deleted_at.is_(None),
    ).all()
    return {p.venue_id: p.image_url for p in photos}


def _to_results(venues: list[Venue], cover_photos: dict) -> list[SearchResult]:
    results = []
    for v in venues:
        starting_price = v.starting_price_paise if v.pricing_mode in ('flat', 'mixed') else v.hourly_rate_paise
        results.append(SearchResult(
            id=v.id,
            name=v.name,
            city=v.city,
            category=v.category,
            capacity=v.max_capacity,
            pricing_mode=v.pricing_mode,
            starting_price_paise=starting_price,
            display_price_min_paise=v.display_price_min_paise,
            display_price_max_paise=v.display_price_max_paise,
            cover_photo_url=cover_photos.get(v.id),
        ))
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
    venues = query.order_by(Venue.created_at.desc()).offset(offset).limit(params.page_size).all()

    venue_ids = [v.id for v in venues]
    cover_photos = {}
    if venue_ids:
        photos = db.query(VenuePhoto).filter(
            VenuePhoto.venue_id.in_(venue_ids),
            VenuePhoto.is_cover == True,
            VenuePhoto.deleted_at.is_(None),
        ).all()
        cover_photos = {p.venue_id: p.image_url for p in photos}

    results = []
    for v in venues:
        starting_price = v.starting_price_paise if v.pricing_mode in ('flat', 'mixed') else v.hourly_rate_paise
        results.append(SearchResult(
            id=v.id,
            name=v.name,
            city=v.city,
            category=v.category,
            capacity=v.max_capacity,
            pricing_mode=v.pricing_mode,
            starting_price_paise=starting_price,
            display_price_min_paise=v.display_price_min_paise,
            display_price_max_paise=v.display_price_max_paise,
            cover_photo_url=cover_photos.get(v.id),
        ))

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
        ).order_by(
            sa_func.ts_rank(Venue.search_vector, ts_query).desc()
        )
    else:
        query = query.order_by(Venue.created_at.desc())

    total_count = query.count()
    offset = (params.page - 1) * params.page_size
    venues = query.offset(offset).limit(params.page_size).all()
    covers = _cover_photos(db, [v.id for v in venues])
    return Page(items=_to_results(venues, covers), total=total_count, page=params.page, page_size=params.page_size)


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
            logger.warning("search_semantic: embedding generation failed (%s), falling back to FTS", exc)
            return search_fts(db, params)
    else:
        query = query.order_by(Venue.created_at.desc())

    total_count = query.count()
    offset = (params.page - 1) * params.page_size
    venues = query.offset(offset).limit(params.page_size).all()
    covers = _cover_photos(db, [v.id for v in venues])
    return Page(items=_to_results(venues, covers), total=total_count, page=params.page, page_size=params.page_size)


# ── Hybrid search ─────────────────────────────────────────────────────────────

def search_hybrid(db: Session, params: SearchParams) -> Page[SearchResult]:
    """Hybrid search: 0.6 × FTS score + 0.4 × semantic score.

    Falls back to search_fts when no embeddings exist yet.
    """
    if not params.q:
        return search_fts(db, params)

    # Check if any embeddings are populated yet.
    has_embeddings = db.query(Venue).filter(
        Venue.status == VenueStatus.approved,
        Venue.is_active == True,
        Venue.deleted_at.is_(None),
        Venue.embedding.isnot(None),
    ).limit(1).count() > 0

    if not has_embeddings:
        return search_fts(db, params)

    from app.modules.search.indexer import generate_query_embedding

    try:
        query_vec = generate_query_embedding(params.q)
    except Exception as exc:
        logger.warning("search_hybrid: embedding generation failed (%s), falling back to FTS", exc)
        return search_fts(db, params)

    # Build base filter conditions as a subquery using raw SQL for the hybrid score.
    # We apply city / venue_type / capacity as additional WHERE clauses below.
    base_filters = [
        "v.status = 'approved'",
        "v.is_active = true",
        "v.deleted_at IS NULL",
        "(v.search_vector @@ plainto_tsquery('english', :q) OR v.embedding IS NOT NULL)",
    ]
    extra_params: dict = {"q": params.q, "qvec": str(query_vec)}

    if params.city:
        base_filters.append("v.city ILIKE :city")
        extra_params["city"] = f"%{params.city}%"
    if params.capacity > 0:
        base_filters.append("v.max_capacity >= :capacity")
        extra_params["capacity"] = params.capacity

    where_clause = " AND ".join(base_filters)

    venue_type_join = ""
    if params.venue_type:
        venue_type_join = "JOIN venue_categories vc ON v.category_id = vc.id"
        where_clause += " AND vc.slug = :venue_type"
        extra_params["venue_type"] = params.venue_type

    count_sql = text(f"""
        SELECT COUNT(*) FROM venues v
        {venue_type_join}
        WHERE {where_clause}
    """)
    total_count = db.execute(count_sql, extra_params).scalar()

    offset = (params.page - 1) * params.page_size
    rows_sql = text(f"""
        SELECT v.id,
               (0.6 * COALESCE(ts_rank(v.search_vector, plainto_tsquery('english', :q)), 0))
               + (0.4 * COALESCE(1 - (v.embedding <=> :qvec::vector), 0)) AS hybrid_score
        FROM venues v
        {venue_type_join}
        WHERE {where_clause}
        ORDER BY hybrid_score DESC
        LIMIT :limit OFFSET :offset
    """)
    extra_params["limit"] = params.page_size
    extra_params["offset"] = offset

    rows = db.execute(rows_sql, extra_params).fetchall()
    venue_ids: list[UUID] = [row[0] for row in rows]

    if not venue_ids:
        return Page(items=[], total=0, page=params.page, page_size=params.page_size)

    # Fetch full Venue objects preserving the ranked order.
    venues_by_id = {
        v.id: v
        for v in db.query(Venue)
        .options(joinedload(Venue.category))
        .filter(Venue.id.in_(venue_ids))
        .all()
    }
    venues = [venues_by_id[vid] for vid in venue_ids if vid in venues_by_id]
    covers = _cover_photos(db, venue_ids)
    return Page(items=_to_results(venues, covers), total=total_count or 0, page=params.page, page_size=params.page_size)
