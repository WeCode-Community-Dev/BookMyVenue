import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class DeepResearchQuery(Base):
    """Logs each Deep Research prompt. Exists primarily so external discovery
    (Phase 2, see docs/DEEP-RESEARCH-PRD.md) can attach `external_venue_leads`
    to `discovered_via_query_id` once the user asks us to search beyond the
    internal catalog."""

    __tablename__ = "deep_research_queries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    query_text: Mapped[str] = mapped_column(Text, nullable=False)
    city_filter: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
