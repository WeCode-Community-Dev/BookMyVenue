"""add google_review_url to venues

Revision ID: 018_venue_google_review_url
Revises: 017_venue_images
Create Date: 2026-07-25

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "018_venue_google_review_url"
down_revision: Union[str, None] = "017_venue_images"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "venues",
        sa.Column("google_review_url", sa.String(length=500), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("venues", "google_review_url")
