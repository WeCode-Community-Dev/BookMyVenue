"""drop_uq_booking_slot

Revision ID: a815996e8371
Revises: 7730c1497963
Create Date: 2026-07-24 10:31:55.533673

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a815996e8371'
down_revision: Union[str, None] = '7730c1497963'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('uq_booking_slot', 'bookings', type_='unique')


def downgrade() -> None:
    op.create_unique_constraint(
        'uq_booking_slot', 'bookings', ['venue_id', 'booking_date', 'time_slot']
    )