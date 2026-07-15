from uuid import UUID

from sqlalchemy import select, func, desc, case, or_
from sqlalchemy.orm import Session

from app.modules.chat.models import ChatMessage


def get_messages(
    db: Session,
    booking_id: UUID,
    limit: int = 50,
    cursor: UUID | None = None,
) -> list[ChatMessage]:
    """Get messages for a booking with cursor-based pagination."""
    query = select(ChatMessage).where(ChatMessage.booking_id == booking_id)

    if cursor:
        query = query.where(ChatMessage.id > cursor)

    query = query.order_by(ChatMessage.created_at.asc()).limit(limit)

    return db.execute(query).scalars().all()


def get_unread_messages(
    db: Session,
    booking_id: UUID,
    user_id: UUID,
) -> list[ChatMessage]:
    """Get unread messages for a user in a booking."""
    query = (
        select(ChatMessage)
        .where(
            ChatMessage.booking_id == booking_id,
            ChatMessage.sender_id != user_id,
            ChatMessage.read_at.is_(None),
        )
        .order_by(ChatMessage.created_at.asc())
    )

    return db.execute(query).scalars().all()


def create_message(
    db: Session,
    booking_id: UUID,
    sender_id: UUID,
    message: str,
) -> ChatMessage:
    """Create a new chat message."""
    chat_message = ChatMessage(
        booking_id=booking_id,
        sender_id=sender_id,
        message=message,
    )
    db.add(chat_message)
    db.flush()
    return chat_message


def mark_messages_read(
    db: Session,
    booking_id: UUID,
    user_id: UUID,
) -> int:
    """Mark all messages as read for a user in a booking. Returns count."""
    unread = get_unread_messages(db, booking_id, user_id)

    for msg in unread:
        msg.read_at = db.execute(select(func.now())).scalar()

    db.flush()
    return len(unread)


def get_booking_participants(
    db: Session,
    booking_id: UUID,
) -> tuple[UUID, UUID]:
    """Get the customer and venue owner IDs for a booking."""
    from app.modules.booking.models import Booking
    from app.modules.venue.models import Venue

    booking = (
        db.execute(select(Booking).where(Booking.id == booking_id))
        .scalars()
        .first()
    )

    if not booking:
        return None, None

    venue = (
        db.execute(select(Venue).where(Venue.id == booking.venue_id))
        .scalars()
        .first()
    )

    if not venue:
        return booking.user_id, None

    return booking.user_id, venue.owner_id


def get_conversations(
    db: Session,
    user_id: UUID,
) -> list[dict]:
    """Get all conversations for a user with aggregated message data.
    
    Returns conversations where the user is a participant (customer or owner),
    only including bookings that have at least one message.
    Uses a single optimized query with joins and subqueries.
    """
    from app.modules.booking.models import Booking, BookingStatus
    from app.modules.venue.models import Venue
    from app.modules.profile.models import Profile
    
    inactive_statuses = [
        BookingStatus.user_cancelled,
        BookingStatus.admin_cancelled,
        BookingStatus.conflict_cancelled,
        BookingStatus.hold_expired,
        BookingStatus.request_expired,
        BookingStatus.owner_rejected,
        BookingStatus.completed,
    ]
    
    # Subquery to get max created_at per booking
    max_created_per_booking = (
        select(
            ChatMessage.booking_id,
            func.max(ChatMessage.created_at).label('max_created_at')
        )
        .group_by(ChatMessage.booking_id)
        .subquery()
    )
    
    # Join to get the full latest message (message with max created_at for each booking)
    latest_message_subq = (
        select(
            ChatMessage.booking_id,
            ChatMessage.message.label('last_message'),
            ChatMessage.created_at.label('last_message_at'),
            ChatMessage.sender_id.label('last_sender_id'),
        )
        .join(
            max_created_per_booking,
            (ChatMessage.booking_id == max_created_per_booking.c.booking_id) &
            (ChatMessage.created_at == max_created_per_booking.c.max_created_at)
        )
        .subquery()
    )
    
    # Subquery to count unread messages per booking for the user
    unread_count_subq = (
        select(
            ChatMessage.booking_id,
            func.count().label('unread_count'),
        )
        .where(
            ChatMessage.sender_id != user_id,
            ChatMessage.read_at.is_(None),
        )
        .group_by(ChatMessage.booking_id)
        .subquery()
    )
    
    # The other_party is: customer if user is owner, owner if user is customer
    other_party_id_case = case(
        (Booking.user_id == user_id, Venue.owner_id),
        else_=Booking.user_id,
    )
    
    # Subquery to get bookings with messages
    bookings_with_messages = (
        select(ChatMessage.booking_id)
        .distinct()
        .subquery()
    )
    
    query = (
        select(
            Booking.id.label('booking_id'),
            Booking.status.label('booking_status'),
            Booking.requested_at.label('booking_date'),
            Venue.name.label('venue_name'),
            Venue.city.label('venue_city'),
            Profile.full_name.label('other_party_name'),
            latest_message_subq.c.last_message,
            latest_message_subq.c.last_message_at,
            latest_message_subq.c.last_sender_id,
            func.coalesce(unread_count_subq.c.unread_count, 0).label('unread_count'),
        )
        .select_from(Booking)
        .join(Venue, Booking.venue_id == Venue.id)
        .join(Profile, Profile.id == other_party_id_case)
        .join(bookings_with_messages, bookings_with_messages.c.booking_id == Booking.id)
        .join(latest_message_subq, latest_message_subq.c.booking_id == Booking.id)
        .outerjoin(unread_count_subq, unread_count_subq.c.booking_id == Booking.id)
        .where(
            Booking.status.not_in(inactive_statuses),
        )
        .where(
            or_(
                Booking.user_id == user_id,
                Venue.owner_id == user_id,
            )
        )
        .order_by(desc(latest_message_subq.c.last_message_at))
    )
    
    results = db.execute(query).all()
    
    return [dict(row._mapping) for row in results]