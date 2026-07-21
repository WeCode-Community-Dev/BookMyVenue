"""update booking status history transition constraint

Revision ID: 23f89ef3a202
Revises: ec2964b424ff
Create Date: 2026-06-20 13:34:34.677352

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = '23f89ef3a202'
down_revision: Union[str, None] = 'ec2964b424ff'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint(
        "ck_booking_status_history_transition", "booking_status_history", type_="check"
    )

    op.create_check_constraint(
        "ck_booking_status_history_transition",
        "booking_status_history",
        """
        (old_status IS NULL) OR
        (old_status = 'requested' AND new_status IN ('owner_accepted', 'owner_rejected', 'user_cancelled', 'conflict_cancelled', 'request_expired')) OR
        (old_status = 'owner_accepted' AND new_status IN ('confirmed', 'hold_expired', 'user_cancelled')) OR
        (old_status = 'confirmed' AND new_status IN ('completed', 'user_cancelled', 'admin_cancelled', 'balance_overdue_cancelled')) OR
        (old_status = 'hold_expired' AND new_status = 'owner_accepted')
        """,
    )


def downgrade() -> None:
    op.drop_constraint(
        "ck_booking_status_history_transition", "booking_status_history", type_="check"
    )
