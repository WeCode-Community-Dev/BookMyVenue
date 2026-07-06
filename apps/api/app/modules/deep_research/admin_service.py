"""Admin-only read layer over deep_research_queries — a simple observability
view of the Deep Research pipeline: what people are searching, how Groq broke
each query down, what internal retrieval returned, and how well it scored.

No admin_actions audit entries here — this is read-only reporting, not an
action that mutates state (contrast with Phase 3's lead/reservation admin
endpoints, which will need audit logging per CLAUDE.md).
"""

from datetime import datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.modules.deep_research.models import DeepResearchQuery
from app.modules.deep_research.schemas import (
    DeepResearchQueryDetail,
    DeepResearchQueryListResponse,
    DeepResearchQuerySummary,
    DeepResearchStatsResponse,
)


def list_queries(
    db: Session, page: int, page_size: int, search: str | None = None
) -> DeepResearchQueryListResponse:
    q = db.query(DeepResearchQuery)
    if search:
        q = q.filter(DeepResearchQuery.query_text.ilike(f"%{search}%"))

    total = q.count()
    rows = (
        q.order_by(DeepResearchQuery.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return DeepResearchQueryListResponse(
        items=[DeepResearchQuerySummary.model_validate(r) for r in rows],
        total=total,
        page=page,
        page_size=page_size,
    )


def get_query_detail(db: Session, query_id: UUID) -> DeepResearchQueryDetail:
    row = db.query(DeepResearchQuery).filter(DeepResearchQuery.id == query_id).first()
    if not row:
        raise NotFoundError("Deep research query not found")
    return DeepResearchQueryDetail.model_validate(row)


def get_query_stats(db: Session, days: int = 30) -> DeepResearchStatsResponse:
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    period_start = today_start - timedelta(days=days - 1)

    rows = (
        db.query(
            func.date_trunc("day", DeepResearchQuery.created_at).label("bucket"),
            func.count(DeepResearchQuery.id).label("cnt"),
            func.avg(DeepResearchQuery.avg_match_score).label("avg_score"),
        )
        .filter(DeepResearchQuery.created_at >= period_start)
        .group_by("bucket")
        .all()
    )
    by_bucket = {r.bucket.replace(tzinfo=timezone.utc): r for r in rows}

    labels: list[str] = []
    counts: list[int] = []
    avg_scores: list[float | None] = []
    for i in range(days - 1, -1, -1):
        day = today_start - timedelta(days=i)
        row = by_bucket.get(day)
        labels.append(f"{day.day} {day.strftime('%b')}")
        counts.append(row.cnt if row else 0)
        avg_scores.append(float(row.avg_score) if row and row.avg_score is not None else None)

    total_queries = db.query(func.count(DeepResearchQuery.id)).scalar() or 0
    avg_result_count = db.query(func.avg(DeepResearchQuery.result_count)).scalar()
    avg_match_score_overall = db.query(func.avg(DeepResearchQuery.avg_match_score)).scalar()

    return DeepResearchStatsResponse(
        labels=labels,
        query_counts=counts,
        avg_match_scores=avg_scores,
        total_queries=total_queries,
        avg_result_count=float(avg_result_count) if avg_result_count is not None else 0.0,
        avg_match_score_overall=(
            float(avg_match_score_overall) if avg_match_score_overall is not None else None
        ),
    )
