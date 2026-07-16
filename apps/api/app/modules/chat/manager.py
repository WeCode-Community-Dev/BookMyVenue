"""WebSocket connection manager for chat rooms."""

import json
import logging
from uuid import UUID

from app.modules.notification.service import notify

logger = logging.getLogger(__name__)


# Global connection registry
# Structure: { booking_id: { user_id: websocket } }
_connections: dict[str, dict[str, any]] = {}


def register_connection(booking_id: UUID, user_id: UUID, websocket) -> None:
    """Register a user's WebSocket connection to a booking room."""
    booking_key = str(booking_id)
    user_key = str(user_id)

    if booking_key not in _connections:
        _connections[booking_key] = {}

    _connections[booking_key][user_key] = websocket
    logger.info(f"Registered WebSocket for user {user_key} on booking {booking_key}")


def unregister_connection(booking_id: UUID, user_id: UUID) -> None:
    """Remove a user's WebSocket connection from a booking room."""
    booking_key = str(booking_id)
    user_key = str(user_id)

    if booking_key in _connections:
        _connections[booking_key].pop(user_key, None)
        if not _connections[booking_key]:
            _connections.pop(booking_key)

    logger.info(f"Unregistered WebSocket for user {user_key} on booking {booking_key}")


def is_user_connected(booking_id: UUID, user_id: UUID) -> bool:
    """Check if a user is connected via WebSocket to a booking."""
    booking_key = str(booking_id)
    user_key = str(user_id)
    return booking_key in _connections and user_key in _connections[booking_key]


async def _broadcast_to_room(
    booking_id: UUID,
    ws_message: str,
    *,
    exclude_user_id: UUID | None = None,
) -> None:
    """Send a raw WebSocket payload to all connected users in a booking room."""
    booking_key = str(booking_id)

    if booking_key not in _connections:
        return

    exclude_key = str(exclude_user_id) if exclude_user_id else None
    disconnected_users: list[str] = []

    for user_key, websocket in _connections[booking_key].items():
        if exclude_key and user_key == exclude_key:
            continue
        try:
            await websocket.send_text(ws_message)
        except Exception as e:
            logger.warning(f"Failed to send to user {user_key}: {e}")
            disconnected_users.append(user_key)

    for user_key in disconnected_users:
        _connections[booking_key].pop(user_key, None)


async def broadcast_message(
    booking_id: UUID,
    sender_id: UUID,
    message_data: dict,
) -> None:
    """Broadcast a message to all connected participants in the booking room."""
    ws_message = json.dumps(
        {
            "type": "message_created",
            "payload": message_data,
        }
    )
    await _broadcast_to_room(booking_id, ws_message, exclude_user_id=sender_id)


async def broadcast_read_receipt(
    booking_id: UUID,
    reader_id: UUID,
) -> None:
    """Notify room participants that messages were marked read by a user."""
    ws_message = json.dumps(
        {
            "type": "messages_read",
            "payload": {
                "booking_id": str(booking_id),
                "reader_id": str(reader_id),
            },
        }
    )
    # Tell everyone else in the room (typically the original sender)
    await _broadcast_to_room(booking_id, ws_message, exclude_user_id=reader_id)


def notify_offline_participant(
    db,
    booking_id: UUID,
    recipient_id: UUID,
    booking_context: dict,
) -> None:
    """Create a notification for an offline participant."""
    if is_user_connected(booking_id, recipient_id):
        return  # User is online, no notification needed

    context = {
        "recipient_id": str(recipient_id),
        **booking_context,
    }
    notify(
        db,
        user_id=recipient_id,
        type="chat_message",
        context=context,
        booking_id=booking_id,
    )
