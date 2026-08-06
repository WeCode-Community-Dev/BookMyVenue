"""create amenities and venue_amenities tables

Revision ID: 006_create_amenities
Revises: 005_create_payments
Create Date: 2026-07-02

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "006_create_amenities"
down_revision: Union[str, None] = "005_create_payments"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create amenities table
    op.create_table(
        "amenities",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name", name="uq_amenity_name"),
    )
    op.create_index(op.f("ix_amenities_id"), "amenities", ["id"], unique=False)

    # Create venue_amenities junction table
    op.create_table(
        "venue_amenities",
        sa.Column("venue_id", sa.Integer(), nullable=False),
        sa.Column("amenity_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["venue_id"], ["venues.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["amenity_id"], ["amenities.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("venue_id", "amenity_id"),
    )


def downgrade() -> None:
    op.drop_table("venue_amenities")
    op.drop_index(op.f("ix_amenities_id"), table_name="amenities")
    op.drop_table("amenities")
