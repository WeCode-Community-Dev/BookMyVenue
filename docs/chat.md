# Chat Feature

Booking-scoped real-time messaging between customers and venue owners.

This document describes the **current implementation** (API, WebSocket protocol, data model, and frontends).

---

## Overview

Each booking has at most one conversation. Only two participants may use it:

| Role | Who | How access is determined |
|------|-----|--------------------------|
| Customer | Booking booker | `booking.user_id == auth.user_id` |
| Venue owner | Venue owner | `venue.owner_id == auth.user_id` |

**Constraints (as implemented):**

- One conversation per booking (no multi-party or venue-wide rooms)
- Text-only messages, max **2000** characters
- Messages are **immutable** (no edit / delete APIs)
- Empty / whitespace-only bodies are rejected
- Newlines and emoji are allowed; clients render text as plain content (React escaping)
- Inbox lists only bookings that **already have at least one message** and are not in terminal/inactive statuses
- Threads can still be opened from booking detail **before** the first message (history is empty until send)

---

## Architecture

```
Customer ──┐
           ├── Booking ── Conversation (implicit) ── ChatMessage[]
Owner   ──┘                    │
                               ├── REST (/api/chat/…)
                               ├── WebSocket (per-booking room)
                               └── Offline → notification type "chat_message"
```

### Backend module layout

```
apps/api/app/modules/chat/
├── __init__.py
├── models.py          # ChatMessage SQLAlchemy model
├── schemas.py         # Request/response Pydantic models
├── repository.py      # DB queries (messages, conversations, participants)
├── service.py         # Auth checks + business rules
├── manager.py         # In-memory WS registry, broadcast, offline notify
├── websocket.py       # WS endpoint + per-message session helpers
└── routes.py          # REST endpoints
```

Routers are mounted in `apps/api/app/main.py`:

| Router | Prefix | Tag |
|--------|--------|-----|
| `chat.routes` | `/api/chat` | `chat` |
| `chat.websocket` | `/api/chat` | `chat-ws` |

### Frontend layout

| Layer | Location |
|-------|----------|
| Shared UI | `packages/ui/src/components/ChatWindow.tsx` |
| API client | `packages/api-client/src/endpoints/chat.ts` |
| User hook | `apps/user-web/src/hooks/useChat.ts` |
| Owner hook | `apps/owner-portal/src/hooks/useChat.ts` |
| User inbox | `apps/user-web/src/pages/MyMessages.tsx` |
| Owner inbox | `apps/owner-portal/src/pages/Messages.tsx` |
| Owner booking tab | `apps/owner-portal/src/components/ChatTab.tsx` |

Hooks in user-web and owner-portal are intentionally parallel (same behavior, separate app packages).

---

## Database

### Table: `chat_messages`

Model: `app.modules.chat.models.ChatMessage`

| Column | Type | Notes |
|--------|------|--------|
| `id` | UUID | Primary key (`uuid4`) |
| `booking_id` | UUID | FK → `bookings.id` |
| `sender_id` | UUID | FK → `profiles.id` |
| `message` | TEXT | Required body |
| `created_at` | timestamptz | Server default `now()` |
| `updated_at` | timestamptz | Nullable (unused by current write paths) |
| `read_at` | timestamptz | Null until recipient marks conversation read |

There is **no** `metadata` / attachments column in the live model.

Indexes for `booking_id` / `sender_id` are defined in Alembic migrations (not on the model class).

### Conversation aggregation

There is no separate `conversations` table. Inbox rows are computed in `repository.get_conversations`:

- Join booking + venue + other party profile
- Require at least one message for that booking
- Latest message (by `created_at`) for preview
- Unread count: messages where `sender_id != current_user` and `read_at IS NULL`
- Ordered by `last_message_at` descending

**Excluded booking statuses** (not shown in inbox):

- `user_cancelled`, `admin_cancelled`, `conflict_cancelled`
- `hold_expired`, `request_expired`, `owner_rejected`
- `completed`

---

## Authorization

Every REST and WebSocket entrypoint resolves participants via `get_booking_participants(booking_id)`:

```
(customer_id, owner_id) = (booking.user_id, venue.owner_id)
```

Access is allowed only if `auth.user_id in (customer_id, owner_id)`.

| Failure | REST | WebSocket |
|---------|------|-----------|
| Booking missing | `404 Not Found` | Close `1008` “Booking not found” |
| Not a participant | `403 Forbidden` | Close `1008` “Not authorized…” |
| Bad / missing token | Auth middleware / 401 | Close `1008` missing/invalid token |

---

## REST API

Base path: **`/api/chat`**  
Auth: authenticated user (`require_auth`).

### `GET /conversations`

Returns the caller’s inbox.

**Response:** `ConversationOut[]`

```json
{
  "booking_id": "uuid",
  "venue_name": "string",
  "venue_city": "string | null",
  "booking_status": "string",
  "booking_date": "iso-datetime | null",
  "other_party_name": "string | null",
  "last_message": "string | null",
  "last_message_at": "iso-datetime | null",
  "last_sender_id": "uuid | null",
  "unread_count": 0
}
```

Notes:

- `booking_date` is sourced from `booking.requested_at` (serialized as ISO string when present)
- Only bookings with messages and non-inactive status

### `GET /bookings/{booking_id}/messages`

**Query params:**

| Param | Default | Description |
|-------|---------|-------------|
| `limit` | `50` | Max rows |
| `cursor` | — | Optional message UUID; returns rows with `id > cursor` |

**Response:** `ChatMessageOut[]` ordered by `created_at` ascending.

```json
{
  "id": "uuid",
  "booking_id": "uuid",
  "sender_id": "uuid",
  "message": "text",
  "created_at": "iso-datetime",
  "read_at": "iso-datetime | null"
}
```

### `POST /bookings/{booking_id}/messages`

**Body:**

```json
{ "message": "string (1–2000 chars after validation)" }
```

**Behavior:**

1. Validate access + strip whitespace + length check (`MAX_MESSAGE_LENGTH = 2000`)
2. Persist message
3. **Broadcast** `message_created` over WebSocket to other connected participants
4. If recipient is **not** connected to this booking room → create offline notification (`type: "chat_message"`)

**Response:** `ChatMessageOut` for the new message.

### `PATCH /bookings/{booking_id}/read`

Marks all unread messages **from the other party** as read (`read_at = now()`).

**Response:**

```json
{
  "success": true,
  "updated_count": 3
}
```

If `updated_count > 0`, broadcasts WebSocket event `messages_read` to the rest of the room (so the sender can update read ticks).

---

## WebSocket API

### Endpoint

```
WS /api/chat/bookings/{booking_id}/ws?token=<jwt>
```

- Token is the Supabase access JWT, passed as a **query parameter** (not `Authorization` header)
- Client helper: `chatEndpoints(client).connectWebSocket(bookingId)` in `@venue404/api-client`
- Base URL from `VITE_API_BASE_URL` (http → ws / https → wss)

### Connection flow

1. Read `token` query param; close `1008` if missing/invalid
2. Resolve profile via Supabase token verify + `profiles` row
3. Resolve booking participants; close `1008` if missing/unauthorized
4. `websocket.accept()`
5. `register_connection(booking_id, user_id, websocket)`
6. Send `{ "type": "connected", "payload": { "booking_id": "..." } }`
7. Message loop until disconnect → `unregister_connection`

### Connection registry

In-process memory in `manager.py`:

```
_connections: { booking_id_str: { user_id_str: WebSocket } }
```

Implications:

- One active socket per user per booking room (re-register overwrites)
- Multi-instance API deployments do **not** share rooms (no Redis fan-out yet)
- `is_user_connected` only sees this process

### Client → server events

| `type` | Payload | Behavior |
|--------|---------|----------|
| `send_message` | `{ "message": "..." }` | Validate with `SendMessageIn`, persist, broadcast `message_created` to others, reply `message_sent` to sender; offline notify if needed |
| `mark_read` | (none required) | Mark unread for caller; broadcast `messages_read`; reply `read_ack` |
| `ping` | (none) | Reply `pong` |

Unknown types → `{ "type": "error", "payload": { "message": "Unknown message type" } }`.

### Server → client events

| `type` | When | Payload highlights |
|--------|------|--------------------|
| `connected` | After accept | `booking_id` |
| `message_created` | New message for **other** participants (WS or REST send) | Full message DTO (string UUIDs in WS path) |
| `message_sent` | Ack to **sender** after successful WS send | Same shape as message DTO |
| `messages_read` | Other party marked conversation read | `booking_id`, `reader_id` |
| `read_ack` | Local ack after WS `mark_read` | `booking_id` |
| `pong` | Response to `ping` | `{}` |
| `error` | Validation / auth / unknown type | `message` |

### Message DTO over the wire (WS)

```json
{
  "id": "uuid-string",
  "booking_id": "uuid-string",
  "sender_id": "uuid-string",
  "message": "text",
  "created_at": "iso-datetime",
  "read_at": null
}
```

---

## Offline notifications

When a message is created and the **recipient is not** registered on the booking’s WebSocket room:

```
notify(
  user_id=recipient_id,
  type="chat_message",
  context={ recipient_id, venue_name?, … },
  booking_id=booking_id,
)
```

- Implemented in `manager.notify_offline_participant`
- Uses the shared notification module (in-app; email pipeline depends on notification config/templates)
- Notification UI deep-links via `getNotificationPath` → `/messages/{booking_id}` for `chat_message`

---

## Business rules (implemented)

| Rule | Implementation |
|------|----------------|
| Max length 2000 | `SendMessageIn` Field + `MAX_MESSAGE_LENGTH` / WS strip checks |
| Non-empty after strip | Service / WS helpers raise `ValueError` |
| Immutable messages | No update/delete endpoints |
| Read = all unread from others | `mark_messages_read` sets `read_at` on each |
| Text only | No attachment fields or upload routes |
| Cursor pagination | Optional `cursor` UUID on list messages (`id > cursor`) |

Constants live in `service.py` (`MAX_MESSAGE_LENGTH = 2000`); not yet wired to `app.core.config` settings.

---

## Frontend

### Routes

**User web**

| Path | Page |
|------|------|
| `/messages` | `MyMessages` (list only on mobile; split-pane desktop) |
| `/messages/:bookingId` | Same `MyMessages` with active thread |
| Booking detail CTA | Navigates to `/messages/:bookingId` |

**Owner portal**

| Path | Page |
|------|------|
| `/messages` | `Messages` split-pane inbox |
| `/messages/:bookingId` | Same `Messages` with active thread |
| Booking detail | `ChatTab` embeds live chat for that booking |

### API client (`@venue404/api-client`)

```ts
chatEndpoints(client).listConversations()
chatEndpoints(client).listMessages(bookingId, { cursor?, limit? })
chatEndpoints(client).sendMessage(bookingId, message)
chatEndpoints(client).markRead(bookingId)
chatEndpoints(client).connectWebSocket(bookingId)  // requires access token
```

Types: `Conversation`, `ChatMessageDto`.

### `useChat(bookingId, currentUserId?)`

Shared behavior in both apps:

| Concern | Behavior |
|---------|----------|
| History | React Query key `['chat-messages', bookingId]` |
| Live updates | WebSocket; merges by message id |
| Reconnect | Exponential backoff (cap 15s) |
| Keepalive | Client `ping` every 25s |
| Optimistic UI | Temp ids `temp-…` with `status: 'sending' \| 'failed'` |
| Fallback send | REST `sendMessage` if socket not open |
| Read | `markRead` when history loads / incoming `message_created` |
| Inbox refresh | Invalidates `chat-conversations` and `owner-chat-conversations` |
| Read ticks | Applies `messages_read` to own sent messages |

Query keys:

- User inbox: `['chat-conversations']` (refetch ~30s on pages)
- Owner inbox: `['owner-chat-conversations']`

### `ChatWindow` (`@venue404/ui`)

Props (high level):

- `messages`, `currentUserId`, `onSendMessage`
- `isLoading`, `isConnected`, optional `typingUsers`, `footerHint`, `disabled`

UI features:

- Grouped bubbles (same sender within 5 minutes)
- Day separators (Today / Yesterday / formatted date)
- Multi-line textarea (Enter send, Shift+Enter newline)
- Character counter near limit
- Jump-to-latest when scrolled up
- Connection banner when disconnected
- Sending / sent / read / failed ticks on own messages
- Loading skeleton + empty state

Optional `typingUsers` is supported in the UI but **no typing WS events** are implemented yet.

### Inbox UX

Both customer and owner inboxes:

- Search filter (venue / guest / preview text)
- Unread badges and totals
- Booking status badge on active thread header
- Live / reconnecting indicator
- Booking fallback fetch when opening a thread not yet in the inbox (zero messages)
- Link to booking detail

---

## End-to-end flows

### Send (WebSocket preferred)

```
Client useChat.sendMessage
  → optimistic bubble (status: sending)
  → WS { type: "send_message", message }
  → server persist
  → other party: message_created
  → sender: message_sent (replaces optimistic)
  → if other offline: chat_message notification
```

### Send (REST fallback)

```
Client POST /messages
  → persist
  → broadcast message_created to WS room
  → offline notify if needed
  → client merges response into local list
```

### Open thread

```
listMessages + connect WebSocket
  → markRead (PATCH)
  → if updated_count > 0: messages_read to other party
  → unread badges clear via conversation query invalidation
```

---

## Error handling

| Scenario | REST | WebSocket |
|----------|------|-----------|
| Booking not found | 404 | Close 1008 |
| Not authorized | 403 | Close 1008 |
| Missing/invalid JWT | 401 / auth layer | Close 1008 |
| Empty message | Validation / 422 or error payload | `{ type: "error" }` |
| Message too long | Validation (max 2000) | `{ type: "error" }` |
| Invalid JSON frame | — | `{ type: "error", "Invalid JSON" }` |
| Unknown event type | — | `{ type: "error", "Unknown message type" }` |

---

## File map (quick reference)

```
apps/api/app/modules/chat/          # Backend module
packages/api-client/src/endpoints/chat.ts
packages/ui/src/components/ChatWindow.tsx
apps/user-web/src/hooks/useChat.ts
apps/user-web/src/pages/MyMessages.tsx
apps/owner-portal/src/hooks/useChat.ts
apps/owner-portal/src/pages/Messages.tsx
apps/owner-portal/src/components/ChatTab.tsx
docs/chat.md                        # This document
```

---

## Known limitations / future work

Implemented architecture supports these extensions; **not** built yet unless noted:

| Item | Status |
|------|--------|
| Read receipts (`read_at` + `messages_read`) | Implemented |
| REST + WS fan-out for send | Implemented |
| Multi-line input, optimistic send, reconnect | Implemented |
| File / image attachments | Not implemented |
| Typing indicators (server events) | UI stub only |
| Message edit / soft delete | Not implemented |
| Cross-instance WS (Redis pub/sub) | Not implemented |
| Cursor pagination by time (vs UUID compare) | Cursor uses `id > cursor` |
| Admin moderation / chat search | Not implemented |
| Read-only chat after booking completion | Inbox hides completed; deep-link policy not fully productized |
| Config-driven max length via settings | Hardcoded `2000` |

---

## Related docs

- Auth: `docs/AUTH_FLOW.md`
- Notifications: notification module + `NotificationItem` deep links
- Architecture overview: `docs/architecture.md`
