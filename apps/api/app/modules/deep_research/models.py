import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, Text, func, BigInteger, Date, Enum, Float
from sqlalchemy.dialects.postgresql import JSONB, UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
import enum
from datetime import date as date_type

from app.core.database import Base


class ExternalLeadStatus(str, enum.Enum):
    DISCOVERED = "discovered"
    CONTACTED = "contacted"
    ONBOARDED = "onboarded"
    REJECTED = "rejected"


class LeadReservationStatus(str, enum.Enum):
    REQUESTED = "requested"
    ADMIN_CONTACTED = "admin_contacted"
    OWNER_CONFIRMED = "owner_confirmed"
    DECLINED = "declined"
    EXPIRED = "expired"



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


class ExternalDiscoveryRequest(Base):
    """
    Owned by external-discovery, NOT deep_research_queries — holds the
    device location the frontend supplies only when the user explicitly
    asks to search externally. Keeping this separate avoids needing a
    migration on a table someone else owns.
    """
    __tablename__ = "external_discovery_requests"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    query_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("deep_research_queries.id"), nullable=False, unique=True
    )
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ExternalVenueLead(Base):
    __tablename__ = "external_venue_leads"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    discovered_via_query_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("deep_research_queries.id"), nullable=False
    )
    source: Mapped[str] = mapped_column(Text, nullable=False, default="google_places")
    source_ref: Mapped[str] = mapped_column(Text, nullable=False, index=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str | None] = mapped_column(Text, nullable=True)
    category_guess: Mapped[str | None] = mapped_column(Text, nullable=True)
    raw_contact_info: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)  # admin-only
    status: Mapped[ExternalLeadStatus] = mapped_column(
        Enum(ExternalLeadStatus, name="external_lead_status"), nullable=False, default=ExternalLeadStatus.DISCOVERED
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class LeadReservation(Base):
    __tablename__ = "lead_reservations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("external_venue_leads.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    status: Mapped[LeadReservationStatus] = mapped_column(
        Enum(LeadReservationStatus, name="lead_reservation_status"), nullable=False, default=LeadReservationStatus.REQUESTED
    )
    platform_fee_paise: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    event_date: Mapped[date_type | None] = mapped_column(Date, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

