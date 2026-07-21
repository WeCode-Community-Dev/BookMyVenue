"""add booking constraints and indices

Revision ID: 914d6f7a8b9c
Revises: feaba28f7d2b
Create Date: 2026-06-09 09:20:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '914d6f7a8b9c'
down_revision: Union[str, None] = 'feaba28f7d2b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Enable btree_gist extension
    op.execute("CREATE EXTENSION IF NOT EXISTS btree_gist")

    # 2. Unique constraint on booking_slots(booking_id)
    op.create_unique_constraint(
        "uq_booking_slots_booking_id",
        "booking_slots",
        ["booking_id"]
    )

    # 3. Partial exclusion constraint booking_slots_no_overlap on booking_slots
    op.execute(
        """
        ALTER TABLE booking_slots
        ADD CONSTRAINT booking_slots_no_overlap
        EXCLUDE USING gist (
            venue_id WITH =,
            tstzrange(effective_starts_at, effective_ends_at) WITH &&
        ) WHERE (is_blocking = true AND deleted_at IS NULL)
        """
    )

    # 4. Partial index idx_booking_slots_conflict_detection on booking_slots
    op.create_index(
        "idx_booking_slots_conflict_detection",
        "booking_slots",
        ["venue_id", "is_blocking", "deleted_at", "effective_starts_at", "effective_ends_at"],
        unique=False,
        postgresql_where=sa.text("is_blocking = true AND deleted_at IS NULL")
    )

    # 5. CHECK constraint ck_booking_status_history_transition on booking_status_history
    op.create_check_constraint(
        "ck_booking_status_history_transition",
        "booking_status_history",
        "old_status IS NULL OR "
        "old_status = new_status OR "
        "(old_status = 'requested' AND new_status IN ('owner_accepted', 'owner_rejected', 'request_expired', 'conflict_cancelled', 'admin_cancelled')) OR "
        "(old_status = 'owner_accepted' AND new_status IN ('confirmed', 'hold_expired', 'user_cancelled', 'admin_cancelled')) OR "
        "(old_status = 'confirmed' AND new_status IN ('completed', 'user_cancelled', 'admin_cancelled', 'balance_overdue_cancelled'))"
    )


def downgrade() -> None:
    op.drop_constraint("ck_booking_status_history_transition", "booking_status_history", type_="check")
    op.drop_index("idx_booking_slots_conflict_detection", table_name="booking_slots")
    op.execute("ALTER TABLE booking_slots DROP CONSTRAINT booking_slots_no_overlap")
    op.drop_constraint("uq_booking_slots_booking_id", "booking_slots", type_="unique")
