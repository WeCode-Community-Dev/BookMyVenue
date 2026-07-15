"""WebSocket connection manager for chat rooms."""
import json
import logging
from uuid import UUID
from typing import Optional

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


async def broadcast_message(
    booking_id: UUID,
    sender_id: UUID,
    message_data: dict,
) -> None:
    """Broadcast a message to all connected participants in the booking room."""
    booking_key = str(booking_id)

    if booking_key not in _connections:
        return

    # Prepare the WebSocket message
    ws_message = json.dumps({
        "type": "message_created",
        "payload": message_data,
    })

    # Send to all connected users in this booking (except sender)
    disconnected_users = []
    for user_key, websocket in _connections[booking_key].items():
        if user_key != str(sender_id):
            try:
                await websocket.send_text(ws_message)
            except Exception as e:
                logger.warning(f"Failed to send to user {user_key}: {e}")
                disconnected_users.append(user_key)

    # Clean up disconnected websockets
    for user_key in disconnected_users:
        _connections[booking_key].pop(user_key, None)


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