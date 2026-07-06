import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class DeepResearchQuery(Base):
    """Logs each Deep Research prompt. Exists primarily so external discovery
    (Phase 2, see docs/DEEP-RESEARCH-PRD.md) can attach `external_venue_leads`
    to `discovered_via_query_id` once the user asks us to search beyond the
    internal catalog.

    Also the source of truth for the admin observability page — the columns
    below capture the LLM breakdown and result summary at search time, since
    those are otherwise only ever logged (not queryable) and the raw match
    scores are computed fresh per-request and never persisted anywhere else.
    """

    __tablename__ = "deep_research_queries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    query_text: Mapped[str] = mapped_column(Text, nullable=False)
    city_filter: Mapped[str | None] = mapped_column(Text, nullable=True)
    # Full QueryUnderstanding.model_dump() — intent/venue_type/capacity/etc.
    understanding_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    result_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    avg_match_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    # Top few results as [{id, name, match_source, match_score}, ...]
    top_results_json: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
