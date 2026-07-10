"""
Admin action immutability tests.

Business rule (CLAUDE.md):
  Admin actions are append-only. Never update. Never delete.

Tests verify:
  1. The DB FK has ON DELETE RESTRICT — deleting an admin's profile is blocked
  2. AdminAction rows have no cascade delete from the ORM side
  3. No DELETE or PUT routes exist for admin_actions
"""

from uuid import uuid4

import pytest
from sqlalchemy.exc import IntegrityError

from app.modules.admin.models import AdminAction
from app.modules.profile.models import Profile
from tests.conftest import seed_user

# ── DB-level constraint ───────────────────────────────────────────────────────


def test_cannot_delete_profile_with_admin_actions(db):
    admin_id, _ = seed_user(db, "super_admin")

    db.add(
        AdminAction(
            id=uuid4(),
            admin_id=admin_id,
            action_type="venue_approved",
            target_type="venue",
            target_id=uuid4(),
            reason="test",
        )
    )
    db.commit()

    with pytest.raises(IntegrityError):
        db.query(Profile).filter(Profile.id == admin_id).delete()
        db.commit()

    db.rollback()


def test_admin_action_row_persists_after_failed_delete(db):
    admin_id, _ = seed_user(db, "super_admin")
    action_id = uuid4()

    db.add(
        AdminAction(
            id=action_id,
            admin_id=admin_id,
            action_type="venue_suspended",
            target_type="venue",
            target_id=uuid4(),
        )
    )
    db.commit()

    try:
        db.query(Profile).filter(Profile.id == admin_id).delete()
        db.commit()
    except IntegrityError:
        db.rollback()

    row = db.query(AdminAction).filter(AdminAction.id == action_id).first()
    assert row is not None


# ── ORM-level: no cascade delete ─────────────────────────────────────────────


def test_admin_action_model_has_no_cascade():
    """The AdminAction model must not define a cascade that enables deletes."""
    mapper = AdminAction.__mapper__
    for rel in mapper.relationships:
        assert "delete" not in (rel.cascade or ""), (
            f"Relationship '{rel.key}' on AdminAction must not cascade deletes"
        )


# ── Route-level: no mutating routes for audit log ────────────────────────────


def test_no_delete_route_for_admin_actions(client, db):
    admin_id, admin_token = seed_user(db, "super_admin")
    action_id = uuid4()

    db.add(
        AdminAction(
            id=action_id,
            admin_id=admin_id,
            action_type="venue_approved",
            target_type="venue",
            target_id=uuid4(),
        )
    )
    db.commit()

    resp = client.delete(
        f"/api/admin/actions/{action_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    # 404 (route doesn't exist) or 405 (method not allowed) — either is correct
    assert resp.status_code in (404, 405)


def test_no_update_route_for_admin_actions(client, db):
    admin_id, admin_token = seed_user(db, "super_admin")
    action_id = uuid4()

    db.add(
        AdminAction(
            id=action_id,
            admin_id=admin_id,
            action_type="venue_approved",
            target_type="venue",
            target_id=uuid4(),
        )
    )
    db.commit()

    resp = client.patch(
        f"/api/admin/actions/{action_id}",
        json={"reason": "overwritten"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code in (404, 405)
