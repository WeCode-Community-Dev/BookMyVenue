"""add_payment_pending_booking_status

Revision ID: 134e235b06e3
Revises: ab7cfebcbee6
Create Date: 2026-07-05 15:59:21.458993

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '134e235b06e3'
down_revision: Union[str, None] = 'ab7cfebcbee6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("""
        ALTER TYPE booking_status
        ADD VALUE IF NOT EXISTS 'payment_pending';
    """)


def downgrade():
    pass
