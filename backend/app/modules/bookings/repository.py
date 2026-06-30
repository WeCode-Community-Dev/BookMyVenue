from datetime import datetime, timezone

from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, ForbiddenError, NotFoundError, ValidationError
from app.modules.bookings.model import Booking, BookingStatus
from app.modules.venues import repository as venues_repo
from app.modules.venues.model import Venue as VenueModel


_ACTIVE_STATUSES = (BookingStatus.pending, BookingStatus.confirmed)
_CANCELABLE_BY_USER = (BookingStatus.pending,)


def list_user_bookings(db: Session, user_id: int) -> list[Booking]:
    return list(db.scalars(select(Booking).where(Booking.user_id == user_id)))


def list_venue_owner_bookings(db: Session, owner_id: int) -> list[Booking]:
    venues = venues_repo.list_owner_venues(db, owner_id)
    venue_ids = [v.id for v in venues]
    if not venue_ids:
        return []
    return list(db.scalars(select(Booking).where(Booking.venue_id.in_(venue_ids))))


def get_booking(db: Session, booking_id: int) -> Booking:
    booking = db.get(Booking, booking_id)
    if not booking:
        raise NotFoundError("Booking not found")
    return booking


def has_conflict(
    db: Session, venue_id: int, start_at: datetime, end_at: datetime, exclude_id: int | None = None
) -> bool:
    stmt = select(Booking).where(
        Booking.venue_id == venue_id,
        Booking.status.in_(_ACTIVE_STATUSES),
        and_(Booking.start_at < end_at, Booking.end_at > start_at),
    )
    if exclude_id is not None:
        stmt = stmt.where(Booking.id != exclude_id)
    return db.scalar(select(stmt.exists())) is True


def create_booking(
    db: Session, user_id: int, venue_id: int, start_at: datetime, end_at: datetime
) -> Booking:
    venue = venues_repo.get_approved_venue(db, venue_id)

    if start_at < datetime.now(timezone.utc):
        raise ValidationError("Cannot book in the past")

    # Lock the venue row for the duration of the transaction so two concurrent
    # booking requests cannot both pass the conflict check (TOCTOU).
    db.execute(
        select(VenueModel).where(VenueModel.id == venue_id).with_for_update()
    )

    if has_conflict(db, venue_id, start_at, end_at):
        raise ConflictError("Venue is already booked for the selected time")

    duration_hours = max((end_at - start_at).total_seconds() / 3600.0, 1.0)
    total_price = round(duration_hours * venue.price_per_hour, 2)

    booking = Booking(
        user_id=user_id,
        venue_id=venue_id,
        start_at=start_at,
        end_at=end_at,
        status=BookingStatus.pending,
        total_price=total_price,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def cancel_booking(db: Session, booking: Booking, user_id: int) -> Booking:
    if booking.user_id != user_id:
        raise ForbiddenError("You cannot cancel this booking")
    if booking.status not in _CANCELABLE_BY_USER:
        raise ConflictError(
            "Only pending bookings can be cancelled by the user. "
            "Contact the owner to cancel a confirmed booking."
        )
    booking.status = BookingStatus.cancelled
    db.commit()
    db.refresh(booking)
    return booking


def decide_booking(
    db: Session, booking: Booking, owner_id: int, accept: bool
) -> Booking:
    venue = venues_repo.get_venue(db, booking.venue_id)
    if venue.owner_id != owner_id:
        raise ForbiddenError("You do not manage this venue's bookings")
    if booking.status != BookingStatus.pending:
        raise ConflictError("Booking is not pending a decision")
    booking.status = BookingStatus.confirmed if accept else BookingStatus.declined
    db.commit()
    db.refresh(booking)
    return booking
