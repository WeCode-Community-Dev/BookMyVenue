"""admin_actions.admin_id nullable for system-detected security events

Revision ID: 9b2e6d4f1a7c
Revises: 7f3a1c9d2b4e
Create Date: 2026-07-15 13:00:00.000000

"""
from typing import Sequence, Union

from alembic import op

revision: str = '9b2e6d4f1a7c'
down_revision: Union[str, None] = '7f3a1c9d2b4e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Lets action_types like admin_password_reset_requested (a system-detected
    # security event with no acting admin) live in the same audit table admins
    # already check, instead of a separate, easy-to-miss channel. The
    # ondelete="RESTRICT" FK is unaffected — RESTRICT never fires for NULL.
    op.alter_column("admin_actions", "admin_id", nullable=True)


def downgrade() -> None:
    op.alter_column("admin_actions", "admin_id", nullable=False)
