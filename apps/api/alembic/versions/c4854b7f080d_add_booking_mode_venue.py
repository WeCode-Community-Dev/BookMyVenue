"""add_booking_mode_venue

Revision ID: c4854b7f080d
Revises: 867c2871ef67
Create Date: 2026-07-05 15:30:56.305238

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'c4854b7f080d'
down_revision: Union[str, None] = '867c2871ef67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


booking_mode_enum = sa.Enum(
    "MANUAL",
    "INSTANT",
    name="booking_mode",
)


def upgrade():
    booking_mode_enum.create(op.get_bind(), checkfirst=True)

    op.add_column(
        "venues",
        sa.Column(
            "booking_mode",
            booking_mode_enum,
            nullable=False,
            server_default="MANUAL",
        ),
    )

    op.alter_column(
        "venues",
        "booking_mode",
        server_default=None,
    )


def downgrade():
    op.drop_column("venues", "booking_mode")
    booking_mode_enum.drop(op.get_bind(), checkfirst=True)
