import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi import HTTPException

from app.db.database import Base
from app.models.user import User
from app.models.booking import Booking
from app.models.venue import Venue
from app.schemas.user import UserProfileUpdate
from app.services.auth_service import (
    hash_password,
    authenticate_user,
    update_user_profile,
)
from app.services.booking_service import get_booking_detail


@pytest.fixture()
def db():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


def _make_user(db, *, email="user@example.com", password="password123", **kwargs):
    user = User(
        name=kwargs.get("name", "Test User"),
        email=email.lower().strip(),
        phone_number=kwargs.get("phone_number", "9999999999"),
        hashed_password=hash_password(password) if password else None,
        auth_provider=kwargs.get("auth_provider", "email"),
        role=kwargs.get("role", "user"),
        google_id=kwargs.get("google_id"),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_update_profile_name_and_phone(db):
    user = _make_user(db)
    updated = update_user_profile(
        db,
        user,
        UserProfileUpdate(name="New Name", phone_number="8888888888"),
    )
    assert updated.name == "New Name"
    assert updated.phone_number == "8888888888"
    assert updated.email == "user@example.com"


def test_email_change_requires_current_password(db):
    user = _make_user(db)
    with pytest.raises(HTTPException) as exc:
        update_user_profile(
            db,
            user,
            UserProfileUpdate(email="new@example.com"),
        )
    assert exc.value.status_code == 400
    assert "Current password is required" in exc.value.detail


def test_email_change_rejects_wrong_password(db):
    user = _make_user(db)
    with pytest.raises(HTTPException) as exc:
        update_user_profile(
            db,
            user,
            UserProfileUpdate(email="new@example.com", current_password="wrongpass"),
        )
    assert exc.value.status_code == 400
    assert "incorrect" in exc.value.detail.lower()


def test_email_change_with_correct_password(db):
    user = _make_user(db)
    updated = update_user_profile(
        db,
        user,
        UserProfileUpdate(email="New.Email@Example.com", current_password="password123"),
    )
    assert updated.email == "new.email@example.com"


def test_duplicate_email_rejected(db):
    _make_user(db, email="taken@example.com", password="password123")
    user = _make_user(db, email="free@example.com", password="password123", name="Other")
    with pytest.raises(HTTPException) as exc:
        update_user_profile(
            db,
            user,
            UserProfileUpdate(email="taken@example.com", current_password="password123"),
        )
    assert exc.value.status_code == 400
    assert "already registered" in exc.value.detail.lower()


def test_password_change_requires_current_password(db):
    user = _make_user(db)
    with pytest.raises(HTTPException) as exc:
        update_user_profile(
            db,
            user,
            UserProfileUpdate(new_password="newpass123"),
        )
    assert exc.value.status_code == 400


def test_password_change_then_login(db):
    user = _make_user(db)
    update_user_profile(
        db,
        user,
        UserProfileUpdate(current_password="password123", new_password="newpass123"),
    )
    with pytest.raises(HTTPException):
        authenticate_user(db, "user@example.com", "password123")
    logged_in = authenticate_user(db, "user@example.com", "newpass123")
    assert logged_in.id == user.id


def test_google_only_cannot_change_email_or_password(db):
    user = _make_user(
        db,
        email="google@example.com",
        password=None,
        auth_provider="google",
        google_id="gid-1",
    )
    with pytest.raises(HTTPException) as exc:
        update_user_profile(
            db,
            user,
            UserProfileUpdate(email="other@example.com", current_password="anything"),
        )
    assert exc.value.status_code == 400
    assert "Google-only" in exc.value.detail


def test_google_only_login_does_not_crash(db):
    _make_user(
        db,
        email="google@example.com",
        password=None,
        auth_provider="google",
        google_id="gid-1",
    )
    with pytest.raises(HTTPException) as exc:
        authenticate_user(db, "google@example.com", "anypassword")
    assert exc.value.status_code == 401


def test_booking_detail_is_owner_only(db):
    owner = _make_user(db, email="owner@example.com", name="Owner")
    other = _make_user(db, email="other@example.com", name="Other")

    venue = Venue(
        owner_id=owner.id,
        name="Hall",
        location="City",
        price_per_day=1000,
        venue_type_id=1,
        approval_status="approved",
        is_active=True,
    )
    db.add(venue)
    db.commit()
    db.refresh(venue)

    from datetime import date, time

    booking = Booking(
        user_id=owner.id,
        venue_id=venue.id,
        booking_date=date(2030, 1, 1),
        time_slot=time(10, 0),
        check_in_date=date(2030, 1, 1),
        check_in_time=time(10, 0),
        check_out_date=date(2030, 1, 1),
        check_out_time=time(18, 0),
        num_days=1,
        amount=1000,
        amount_paid=1000,
        balance_due=0,
        status="booked",
        owner_status="accepted",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    detail = get_booking_detail(db, owner, booking.id)
    assert detail["id"] == booking.id

    with pytest.raises(HTTPException) as exc:
        get_booking_detail(db, other, booking.id)
    assert exc.value.status_code == 404
