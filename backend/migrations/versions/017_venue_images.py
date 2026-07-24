"""venue images gallery table

Revision ID: 017_venue_images
Revises: 015_venue_cancellation_policy
Create Date: 2026-07-25

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect

revision: str = "017_venue_images"
down_revision: Union[str, None] = "015_venue_cancellation_policy"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    if inspect(bind).has_table("venue_images"):
        return

    op.create_table(
        "venue_images",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("venue_id", sa.Integer(), nullable=False),
        sa.Column("url", sa.String(length=500), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_cover", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.ForeignKeyConstraint(["venue_id"], ["venues.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_venue_images_venue_sort",
        "venue_images",
        ["venue_id", "sort_order"],
    )

    # Existing single hero image becomes the cover of the new gallery.
    op.execute(
        """
        INSERT INTO venue_images (venue_id, url, sort_order, is_cover)
        SELECT id, image_url, 0, true
        FROM venues
        WHERE image_url IS NOT NULL AND image_url <> ''
        """
    )


def downgrade() -> None:
    op.drop_index("ix_venue_images_venue_sort", table_name="venue_images")
    op.drop_table("venue_images")
