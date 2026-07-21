"""profiles: add email column

Revision ID: 0003
Revises: 0002
Create Date: 2026-06-04

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("profiles", sa.Column("email", sa.String, nullable=True))
    op.create_index("ix_profiles_email", "profiles", ["email"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_profiles_email", table_name="profiles")
    op.drop_column("profiles", "email")
