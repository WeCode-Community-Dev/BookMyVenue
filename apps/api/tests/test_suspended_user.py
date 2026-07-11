"""
Suspended user access tests.

Business rule: a suspended user must be denied access to every protected route
even when they hold a valid JWT.
"""

from uuid import uuid4

from app.modules.profile.models import ProfileStatus, UserRole, UserRoleAssignment
from tests.conftest import make_token, seed_auth_user


def _seed_suspended(db, role: str):
    user_id = uuid4()
    email = f"suspended-{user_id.hex[:6]}@test.com"
    seed_auth_user(db, user_id, email, status=ProfileStatus.suspended)
    if role != "customer":
        db.add(UserRoleAssignment(user_id=user_id, role=UserRole(role)))
    db.commit()
    return make_token(user_id, email)


def test_suspended_customer_cannot_list_bookings(client, db):
    token = _seed_suspended(db, "customer")
    resp = client.get("/api/bookings/", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 403


def test_suspended_owner_cannot_list_venues(client, db):
    token = _seed_suspended(db, "venue_owner")
    resp = client.get("/api/venues/my/venues", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 403


def test_suspended_user_cannot_create_booking(client, db, category_id):
    from tests.conftest import create_booking, seed_approved_venue, seed_user

    owner_id, _ = seed_user(db, "venue_owner")
    venue_id = seed_approved_venue(db, owner_id, category_id)
    suspended_token = _seed_suspended(db, "customer")

    resp = create_booking(client, suspended_token, venue_id)
    assert resp.status_code == 403


def test_suspended_admin_cannot_access_admin_routes(client, db):
    token = _seed_suspended(db, "super_admin")
    resp = client.get("/api/admin/venues", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 403
