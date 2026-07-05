"""add_external_venue

Revision ID: 9d384c376ed1
Revises: 5134b9fb1f9e
Create Date: 2026-07-05 17:42:56.616078

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '9d384c376ed1'
down_revision: Union[str, None] = '5134b9fb1f9e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


 
def upgrade() -> None:
    op.create_table(
        "external_venue_staging",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("place_id", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("formatted_address", sa.String(), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("phone", sa.String(), nullable=True),
        sa.Column("website", sa.String(), nullable=True),
        sa.Column("rating", sa.Float(), nullable=True),
        sa.Column("user_ratings_total", sa.Integer(), nullable=True),
        sa.Column("raw_types", sa.JSON(), nullable=True),
        sa.Column("source_query", sa.String(), nullable=False),
        sa.Column(
            "status",
            sa.Enum(
                "candidate", "reserved", "contacted", "converted", "listed", "rejected",
                name="external_venue_status",
            ),
            nullable=False,
            server_default="candidate",
        ),
        sa.Column("details_enriched", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("first_seen_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("place_id", name="uq_external_venue_place_id"),
    )
    op.create_index(
        "ix_external_venue_staging_place_id", "external_venue_staging", ["place_id"]
    )
 
    op.create_table(
        "external_venue_reservations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "venue_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("external_venue_staging.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
 
 
def downgrade() -> None:
    op.drop_table("external_venue_reservations")
    op.drop_table("external_venue_staging")
    op.execute("DROP TYPE IF EXISTS external_venue_status")