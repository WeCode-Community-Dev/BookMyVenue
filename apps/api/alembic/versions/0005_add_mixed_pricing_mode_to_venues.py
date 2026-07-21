"""add mixed pricing mode to venues

Revision ID: 1ce66f7c8bf4
Revises: 9170dab48e33
Create Date: 2026-06-06 08:33:44.531549

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '1ce66f7c8bf4'
down_revision: Union[str, None] = '9170dab48e33'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
   
    op.drop_constraint('ck_venues_pricing_mode', 'venues', type_='check')
    op.create_check_constraint('ck_venues_pricing_mode', 'venues', "pricing_mode IN ('flat', 'hourly', 'mixed')")


def downgrade() -> None:
    
    op.drop_constraint('ck_venues_pricing_mode', 'venues', type_='check')
    op.create_check_constraint('ck_venues_pricing_mode', 'venues', "pricing_mode IN ('flat', 'hourly')")
