"""update_booking_status_history_constraint

Revision ID: bf4731fd3ac6
Revises: 134e235b06e3
Create Date: 2026-07-05 16:06:07.393205

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'bf4731fd3ac6'
down_revision: Union[str, None] = '134e235b06e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


CHECK_CONSTRAINT = """
(old_status IS NULL)

OR

(old_status = 'requested'
    AND new_status IN (
        'owner_accepted',
        'owner_rejected',
        'request_expired',
        'conflict_cancelled',
        'admin_cancelled',
        'user_cancelled'
    ))

OR

(old_status = 'payment_pending'
    AND new_status IN (
        'confirmed',
        'hold_expired',
        'user_cancelled',
        'admin_cancelled',
        'conflict_cancelled'
    ))

OR

(old_status = 'owner_accepted'
    AND new_status IN (
        'confirmed',
        'hold_expired',
        'user_cancelled',
        'admin_cancelled'
    ))

OR

(old_status = 'confirmed'
    AND new_status IN (
        'completed',
        'user_cancelled',
        'admin_cancelled',
        'balance_overdue_cancelled'
    ))
"""


def upgrade() -> None:
    op.drop_constraint(
        "ck_booking_status_history_transition",
        "booking_status_history",
        type_="check",
    )

    op.create_check_constraint(
        "ck_booking_status_history_transition",
        "booking_status_history",
        CHECK_CONSTRAINT,
    )


def downgrade() -> None:
    op.drop_constraint(
        "ck_booking_status_history_transition",
        "booking_status_history",
        type_="check",
    )

    op.create_check_constraint(
        "ck_booking_status_history_transition",
        "booking_status_history",
        """
        (old_status IS NULL)

        OR

        (old_status = 'requested'
            AND new_status IN (
                'owner_accepted',
                'owner_rejected',
                'request_expired',
                'conflict_cancelled',
                'admin_cancelled'
            ))

        OR

        (old_status = 'owner_accepted'
            AND new_status IN (
                'confirmed',
                'hold_expired',
                'user_cancelled',
                'admin_cancelled'
            ))

        OR

        (old_status = 'confirmed'
            AND new_status IN (
                'completed',
                'user_cancelled',
                'admin_cancelled',
                'balance_overdue_cancelled'
            ))
        """,
    )
