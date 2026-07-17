from uuid import UUID

from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenError, NotFoundError
from app.modules.chat.repository import (
    create_message,
    get_booking_participants,
    get_conversations,
    get_messages,
    mark_messages_read,
)
from app.modules.chat.schemas import ChatMessageOut, ConversationOut, MarkReadOut

# Max message length config - will be read from settings when available
MAX_MESSAGE_LENGTH = 2000


def list_messages(
    db: Session,
    booking_id: UUID,
    user_id: UUID,
    limit: int = 50,
    cursor: UUID | None = None,
) -> list[ChatMessageOut]:
    """Get message history for a booking. Validates access first."""
    customer_id, owner_id = get_booking_participants(db, booking_id)

    if customer_id is None:
        raise NotFoundError("Booking not found")

    if user_id not in (customer_id, owner_id):
        raise ForbiddenError("Not authorized to access this chat")

    messages = get_messages(db, booking_id, limit, cursor)
    return [_to_output(msg) for msg in messages]


def list_conversations(
    db: Session,
    user_id: UUID,
) -> list[ConversationOut]:
    """Get all conversations for a user with aggregated message data."""
    rows = get_conversations(db, user_id)
    return [_conversation_to_output(row) for row in rows]


def _conversation_to_output(row: dict) -> ConversationOut:
    """Convert conversation row to output schema."""
    return ConversationOut(
        booking_id=row["booking_id"],
        venue_name=row["venue_name"],
        venue_city=row.get("venue_city"),
        booking_status=row["booking_status"],
        booking_date=row["booking_date"].isoformat() if row.get("booking_date") else None,
        other_party_name=row["other_party_name"],
        last_message=row["last_message"],
        last_message_at=row["last_message_at"].isoformat() if row.get("last_message_at") else None,
        last_sender_id=row["last_sender_id"],
        unread_count=row["unread_count"],
    )


def send_message(
    db: Session,
    booking_id: UUID,
    sender_id: UUID,
    message: str,
) -> ChatMessageOut:
    """Send a message to a booking chat. Validates access and creates notification."""
    customer_id, owner_id = get_booking_participants(db, booking_id)

    if customer_id is None:
        raise NotFoundError("Booking not found")

    if sender_id not in (customer_id, owner_id):
        raise ForbiddenError("Not authorized to send messages to this chat")

    # Normalize + validate message body
    cleaned = (message or "").strip()
    if not cleaned:
        raise ValueError("Message cannot be empty")

    if len(cleaned) > MAX_MESSAGE_LENGTH:
        raise ValueError(f"Message exceeds {MAX_MESSAGE_LENGTH} characters")

    chat_message = create_message(db, booking_id, sender_id, cleaned)

    return _to_output(chat_message)


def send_message_and_notify(
    db: Session,
    booking_id: UUID,
    sender_id: UUID,
    message: str,
) -> ChatMessageOut:
    """Send message and trigger notification for offline recipient (async)."""
    result = send_message(db, booking_id, sender_id, message)
    # Note: notify_offline_participant will be called in websocket.py async context
    return result


def mark_as_read(
    db: Session,
    booking_id: UUID,
    user_id: UUID,
) -> MarkReadOut:
    """Mark all unread messages in a booking as read."""
    customer_id, owner_id = get_booking_participants(db, booking_id)

    if customer_id is None:
        raise NotFoundError("Booking not found")

    if user_id not in (customer_id, owner_id):
        raise ForbiddenError("Not authorized to access this chat")

    count = mark_messages_read(db, booking_id, user_id)
    if count > 0:
        db.commit()

    return MarkReadOut(updated_count=count)


def _to_output(msg) -> ChatMessageOut:
    """Convert ChatMessage model to output schema."""
    return ChatMessageOut(
        id=msg.id,
        booking_id=msg.booking_id,
        sender_id=msg.sender_id,
        message=msg.message,
        created_at=msg.created_at.isoformat() if msg.created_at else None,
        read_at=msg.read_at.isoformat() if msg.read_at else None,
    )


def get_venue_name_for_notification(db: Session, booking_id: UUID) -> str | None:
    """Get venue name for notification context. Used by WebSocket sender."""
    from sqlalchemy import select

    from app.modules.booking.models import Booking
    from app.modules.venue.models import Venue

    booking = db.execute(select(Booking).where(Booking.id == booking_id)).scalar_one_or_none()
    if not booking:
        return None
    venue = db.execute(select(Venue).where(Venue.id == booking.venue_id)).scalar_one_or_none()
    return venue.name if venue else None


def get_booking_participants_for_ws(
    db: Session,
    booking_id: UUID,
) -> tuple[UUID, UUID]:
    """Get booking participants for WebSocket auth (no exceptions, returns None for missing)."""
    return get_booking_participants(db, booking_id)
