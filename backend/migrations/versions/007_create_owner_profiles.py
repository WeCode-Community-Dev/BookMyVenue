"""create owner_profiles table

Revision ID: 007_create_owner_profiles
Revises: 006_create_amenities
Create Date: 2026-07-02

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "007_create_owner_profiles"
down_revision: Union[str, None] = "006_create_amenities"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "owner_profiles",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("business_name", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_owner_profiles_id"), "owner_profiles", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_owner_profiles_id"), table_name="owner_profiles")
    op.drop_table("owner_profiles")
