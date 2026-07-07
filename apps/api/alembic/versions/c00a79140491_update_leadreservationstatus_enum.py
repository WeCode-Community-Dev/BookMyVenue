"""Update LeadReservationStatus enum

Revision ID: c00a79140491
Revises: d1e2f3a4b5c6
Create Date: 2026-07-06 13:24:27.472285

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql



revision: str = 'c00a79140491'
down_revision: Union[str, None] = 'd1e2f3a4b5c6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Rename existing enum
    op.execute("ALTER TYPE lead_reservation_status RENAME TO lead_reservation_status_old")
    
    # 2. Create new enum
    op.execute("CREATE TYPE lead_reservation_status AS ENUM('new', 'contacted', 'owner_interested', 'owner_invited', 'owner_onboarded', 'venue_draft_created', 'venue_pending_approval', 'venue_approved', 'booking_created', 'closed', 'cancelled', 'rejected')")
    
    # 3. Alter table to use varchar temporarily, map data, then cast to new enum
    op.execute("ALTER TABLE lead_reservations ALTER COLUMN status TYPE VARCHAR USING status::text")
    op.execute("UPDATE lead_reservations SET status = 'new' WHERE status = 'requested'")
    op.execute("ALTER TABLE lead_reservations ALTER COLUMN status TYPE lead_reservation_status USING status::lead_reservation_status")
    
    # 4. Drop old enum
    op.execute("DROP TYPE lead_reservation_status_old")

def downgrade() -> None:
    pass
