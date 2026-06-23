from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "003_create_venues"
down_revision: Union[str, None] = "002_create_refresh_tokens"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "venues",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("location", sa.String(length=255), nullable=False),
        sa.Column("price_per_day", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "approval_status",
            sa.String(length=20),
            server_default="pending",
            nullable=False,
        ),
        sa.Column("rejection_reason", sa.Text(), nullable=True),
        sa.Column(
            "average_rating",
            sa.Numeric(precision=3, scale=2),
            server_default="0.00",
            nullable=True,
        ),
        sa.Column(
            "total_reviews",
            sa.Integer(),
            server_default="0",
            nullable=False,
        ),
        sa.Column(
            "is_active",
            sa.Boolean(),
            server_default=sa.text("true"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint("price_per_day >= 0", name="ck_venue_price_non_negative"),
        sa.CheckConstraint(
            "approval_status IN ('pending', 'approved', 'rejected')",
            name="ck_venue_approval_status",
        ),
        sa.CheckConstraint(
            "average_rating >= 0 AND average_rating <= 5",
            name="ck_venue_average_rating",
        ),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_venues_id"), "venues", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_venues_id"), table_name="venues")
    op.drop_table("venues")
