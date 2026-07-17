# Chat Feature

**Status:** Shipped — verified against code, 2026-07-17

A booking-scoped messaging system enabling real-time communication between customers and venue owners.

## Overview

The chat feature allows two parties to communicate within the context of a booking:
- **Customer**: Can send messages to the venue owner about their booking
- **Venue Owner**: Can respond to customer inquiries and communicate arrangements

**Important constraints:**
- One conversation per booking (booking-scoped)
- Only the booking customer and venue owner can participate
- Messages are immutable once sent
- Chat is available from booking creation until booking completion (read-only after completion is reserved for future business rules)

## Architecture

```
Customer
        \
         \
       Booking
           |
           |
     Conversation
           |
    ----------------
    |      |      |
 Message Message Message
           |
      Notification
           |
      WebSocket
```

### Module Structure

```
app/modules/chat/
├── __init__.py
├── models.py          # SQLAlchemy models
├── schemas.py         # Pydantic schemas
├── repository.py      # Database access layer
├── service.py         # Business logic
├── manager.py         # WebSocket connection manager
├── websocket.py       # WebSocket endpoint
└── routes.py          # REST API endpoints
```

## Database

### chat_messages Table

| Column    | Type      | Notes                    |
|-----------|-----------|--------------------------|
| id        | UUID      | Primary key              |
| booking_id| UUID      | FK to bookings           |
| sender_id | UUID      | FK to profiles           |
| message   | TEXT      | Required, max 2000 chars |
| created_at| TIMESTAMP | Auto-set                 |
| updated_at| TIMESTAMP | Nullable                 |
| read_at   | TIMESTAMP | Nullable                 |

### Indexes
- `booking_id` - Efficient message history queries
- `sender_id` - Filter by sender
- `created_at` - Chronological ordering

## Authorization

Access to a booking's chat is granted if:

1. **Customer**: User owns the booking (`booking.user_id == auth.user_id`)
2. **Venue Owner**: User owns the venue (`venue.owner_id == auth.user_id`)

Unauthorized access returns `403 Forbidden`.

## API Endpoints

### REST

```
GET  /api/chat/bookings/{booking_id}/messages
    - Query params: cursor, limit (for pagination)
    - Returns: List[ChatMessageOut]

POST /api/chat/bookings/{booking_id}/messages
    - Body: { message: string }
    - Returns: ChatMessageOut (new message)

PATCH /api/chat/bookings/{booking_id}/read
    - Marks all unread messages as read
    - Returns: { success: true }
```

### WebSocket

```
WS /api/chat/bookings/{booking_id}/ws
```

**Authentication**: JWT token in `Authorization` header

**Connection Flow**:
1. Authenticate via JWT
2. Validate booking access
3. Join booking room
4. Receive real-time message events

**Server → client events**:
```json
{ "type": "connected", "payload": { "booking_id": "uuid" } }
{ "type": "message_created", "payload": { "id": "uuid", "booking_id": "uuid", "sender_id": "uuid", "message": "text", "created_at": "iso-datetime", "read_at": null } }
{ "type": "message_sent", "payload": { /* same as message_created — ack to sender */ } }
{ "type": "messages_read", "payload": { "booking_id": "uuid", "reader_id": "uuid" } }
{ "type": "pong", "payload": {} }
{ "type": "error", "payload": { "message": "..." } }
```

**Client → server events**:
```json
{ "type": "send_message", "message": "text" }
{ "type": "mark_read" }
{ "type": "ping" }
```

## Offline Notifications

When a message is sent and the recipient is not connected via WebSocket:

1. Create an `InAppNotification` using the existing notification module
2. Send email notification via the existing email pipeline
3. Email does NOT include message body for privacy

```
Message Created
       |
       v
Recipient Connected? -- No --> Create Notification --> Email Pipeline
       |
      Yes
       |
   WebSocket Event
```

## Frontend Integration

### User Web
- Split-pane inbox at `/messages` and `/messages/:bookingId`
- Booking detail page links into the thread (works even before the first message)
- Real-time updates via WebSocket with REST fallback when the socket is down
- Auto mark-as-read on open; unread badges on the conversation list
- Auto-scroll, day separators, optimistic send, jump-to-latest

### Owner Portal
- Same split-pane inbox UX at `/messages` and `/messages/:bookingId`
- Embedded `ChatTab` on booking detail with a fixed-height chat window

### Shared UI Components (packages/ui)
- `ChatWindow` — full chat surface (list, input, connection banner, typing)
- Day separators, grouped bubbles, read ticks, multi-line textarea input
- Loading skeleton + empty state + jump-to-latest control

## Business Rules

- Messages are text-only (no attachments in v1)
- Max message length: 2000 characters
- Empty messages rejected
- HTML sanitized on input
- Emoji supported
- Newlines preserved
- Messages are immutable (no edit/delete)
- Cursor-based pagination for history

## Configuration

`MAX_MESSAGE_LENGTH = 2000` is a module constant in `chat/service.py` (enforced again in `schemas.py` and `websocket.py`), not an admin-configurable `platform_settings` value.

## Error Handling

| Scenario                  | Response                    |
|---------------------------|-----------------------------|
| Booking not found         | 404 Not Found               |
| Unauthorized access       | 403 Forbidden               |
| WebSocket auth failure    | Connection closed (1008)    |
| Empty message             | 400 Bad Request             |
| Oversized message         | 400 Bad Request             |
| Database failure          | 500 Internal Server Error   |

## Future Extensions

The architecture supports future enhancements:

- File/image attachments (add to metadata or new table)
- Voice notes (URL in metadata)
- Typing indicators (WebSocket events)
- Message reactions (new table)
- Message editing (update updated_at)
- Soft deletion (deleted_at column)
- System-generated booking events
- Admin moderation tools
- Chat search
- Push notifications (via SNS/APNs)
- Read receipts (enhanced read_at logic)
- Delivery receipts