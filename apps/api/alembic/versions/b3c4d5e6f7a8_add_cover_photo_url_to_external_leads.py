"""add_cover_photo_url_to_external_leads

Revision ID: b3c4d5e6f7a8
Revises: a2b3c4d5e6f7
Create Date: 2026-07-06 12:22:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'b3c4d5e6f7a8'
down_revision: Union[str, None] = 'a2b3c4d5e6f7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Cloudinary URL — null until the background job successfully uploads the photo.
    op.add_column('external_venue_leads', sa.Column('cover_photo_url', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('external_venue_leads', 'cover_photo_url')
