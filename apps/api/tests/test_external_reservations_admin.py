"""
External reservation admin conversion workflow.

Business rule (docs/Venue404_External_Reservation_Onboarding_PRD.md):
  Admin converts a customer's external-venue reservation into an onboarded
  owner + draft venue + normal Venue404 booking, status-driven, fully audited.

The venue category is captured from the customer at reservation time (a
dropdown of real venue_categories), not guessed or configured by an admin —
so invite_owner_for_reservation() can call the exact same create_venue()
every organically-registered owner uses, no separate defaults table needed.

Covers the happy-path status chain up through owner invitation (the deepest
point reachable without a real Supabase project / payment stack):
  NEW -> CONTACTED -> OWNER_INTERESTED -> OWNER_INVITED
"""

from uuid import uuid4

import pytest

from app.modules.admin.models import AdminAction
from app.modules.auth.providers.base import ProviderUser
from app.modules.deep_research import service as reservation_service
from app.modules.deep_research.models import (
    DeepResearchQuery,
    ExternalVenueLead,
    LeadReservation,
    LeadReservationStatus,
)
from app.modules.profile.models import Profile, ProfileStatus, UserRole, UserRoleAssignment
from app.modules.venue.models import Venue
from tests.conftest import seed_user


def _seed_reservation(db, category_id=None, guest_count=450):
    customer_id, _ = seed_user(db, "customer")

    query = DeepResearchQuery(user_id=customer_id, query_text="banquet hall in kochi")
    db.add(query)
    db.flush()

    lead = ExternalVenueLead(
        discovered_via_query_id=query.id,
        source_ref="place-123",
        name="Grand Palace Kochi",
        city="Kochi",
        formatted_address="MG Road, Kochi",
        raw_contact_info={"phone": "+911234567890"},
    )
    db.add(lead)
    db.flush()

    reservation = LeadReservation(
        lead_id=lead.id,
        user_id=customer_id,
        category_id=category_id,
        guest_count=guest_count,
    )
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation, customer_id


def _mock_invite(monkeypatch, db, invited_user_id):
    def fake_create_invite_link(self, email, *, full_name=None, phone=None, redirect_to=None):
        # Mirrors what the `handle_new_user` DB trigger does for a real invite.
        db.add(
            Profile(
                id=invited_user_id,
                email=email,
                full_name=full_name,
                phone=phone,
                status=ProfileStatus.active,
            )
        )
        db.add(UserRoleAssignment(user_id=invited_user_id, role=UserRole.customer))
        db.commit()
        return ProviderUser(
            id=invited_user_id, email=email
        ), "https://example.com/accept-invite?token=fake"

    monkeypatch.setattr(
        "app.modules.auth.providers.supabase.SupabaseAuthProvider.create_invite_link",
        fake_create_invite_link,
    )


def test_reservation_conversion_happy_path(db, category_id, monkeypatch):
    admin_id, _ = seed_user(db, "super_admin")
    reservation, _customer_id = _seed_reservation(db, category_id=category_id)

    # ── Contact ────────────────────────────────────────────────────────────
    reservation_service.contact_reservation(
        db,
        admin_id=admin_id,
        reservation_id=reservation.id,
        contact_method="phone",
        notes="Owner open to onboarding",
        follow_up_date=None,
    )
    db.refresh(reservation)
    assert reservation.status == LeadReservationStatus.CONTACTED
    assert reservation.contact_method == "phone"

    # ── Mark interested ────────────────────────────────────────────────────
    reservation_service.mark_owner_interested(db, admin_id=admin_id, reservation_id=reservation.id)
    db.refresh(reservation)
    assert reservation.status == LeadReservationStatus.OWNER_INTERESTED

    # ── Invite owner (Supabase call mocked — no real network/project) ─────
    invited_user_id = uuid4()
    _mock_invite(monkeypatch, db, invited_user_id)

    _reservation, action_link = reservation_service.invite_owner_for_reservation(
        db,
        admin_id=admin_id,
        reservation_id=reservation.id,
        venue_name="Grand Palace Kochi",
        owner_name="Ravi Kumar",
        email="ravi@example.com",
        phone="+911234567890",
    )
    assert action_link
    db.refresh(reservation)

    assert reservation.status == LeadReservationStatus.OWNER_INVITED
    assert reservation.owner_id == invited_user_id
    assert reservation.venue_id is not None
    assert reservation.owner_invited_at is not None

    venue = db.get(Venue, reservation.venue_id)
    assert venue.name == "Grand Palace Kochi"
    assert venue.owner_id == invited_user_id
    assert venue.category_id == category_id
    assert (
        venue.max_capacity == 450
    )  # reservation's guest_count, same as CreateVenueWizard would submit
    assert venue.status.value == "draft"

    owner_role = (
        db.query(UserRoleAssignment)
        .filter(
            UserRoleAssignment.user_id == invited_user_id,
            UserRoleAssignment.role == UserRole.venue_owner,
        )
        .first()
    )
    assert owner_role is not None

    actions = db.query(AdminAction).filter(AdminAction.target_id == reservation.id).all()
    action_types = {a.action_type for a in actions}
    assert action_types == {
        "external_reservation_contacted",
        "external_reservation_owner_interested",
        "external_reservation_owner_invited",
    }


def test_invite_owner_requires_a_category(db, category_id, monkeypatch):
    """Reservations created before category selection existed (or any edge
    case with no category) block invite-owner until an admin supplies one."""
    admin_id, _ = seed_user(db, "super_admin")
    reservation, _ = _seed_reservation(db, category_id=None)

    reservation_service.contact_reservation(
        db,
        admin_id=admin_id,
        reservation_id=reservation.id,
        contact_method="phone",
        notes="",
        follow_up_date=None,
    )
    reservation_service.mark_owner_interested(db, admin_id=admin_id, reservation_id=reservation.id)

    with pytest.raises(Exception):
        reservation_service.invite_owner_for_reservation(
            db,
            admin_id=admin_id,
            reservation_id=reservation.id,
            venue_name="X",
            owner_name=None,
            email="x@example.com",
            phone=None,
        )

    # Admin can still supply category_id explicitly as a fallback.
    invited_user_id = uuid4()
    _mock_invite(monkeypatch, db, invited_user_id)

    reservation_service.invite_owner_for_reservation(
        db,
        admin_id=admin_id,
        reservation_id=reservation.id,
        venue_name="X",
        owner_name=None,
        email="x@example.com",
        phone=None,
        category_id=category_id,
    )
