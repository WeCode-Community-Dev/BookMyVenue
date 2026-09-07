# Notification Module — Low Level Design

**Project:** Venue Booking Platform
**Module:** 5 of 6 — Notification
**Status:** ✅ Approved for Phase 1
**Version:** 1.0
**Last Updated:** 2026-06-22

---

## Page Tree

- [1. Scope](#1-scope)
- [2. Database Schema](#2-database-schema-prisma)
- [3. API Endpoints](#3-api-endpoints)
- [4. Request / Response Contracts](#4-request--response-contracts)
- [5. The Public Service Method (create)](#5-the-public-service-method-create)
- [6. Real-Time Delivery — Polling, Not Sockets](#6-real-time-delivery--polling-not-sockets)
- [7. NestJS Module Structure](#7-nestjs-module-structure)
- [8. Cross-Module Calls](#8-cross-module-calls)
- [9. Validation Rules (DTOs)](#9-validation-rules-dtos)
- [10. Sequence Flows](#10-sequence-flows)
- [11. Edge Cases Handled](#11-edge-cases-handled)
- [12. Out of Scope (Phase 1)](#12-out-of-scope-phase-1)
- [13. Decision Log](#13-decision-log)
- [14. Open Questions](#14-open-questions)

---

## 1. Scope

This module owns the storage, creation, and retrieval of in-app notifications — the bell-icon feed referenced throughout the UI review that originally surfaced this need. It is the standalone module Authentication, Venue, Booking, and Admin all reference but none of them own, exactly as recorded in each of their own LLDs.

> 🔗 **Cross-module dependency:** This is the most-depended-upon module in the system in terms of *being called*, while having almost no dependencies of its own. Authentication, Venue, Booking, and Admin all call `NotificationService.create(...)` directly — a plain in-process service call, never a schema relation, never a message queue. This module's only schema relation, in either direction, is `Notification.userId → User.id`.

> 📦 **Module boundary note:** This module does not know or care *why* a notification was created — it has no concept of bookings, venues, or admin actions. It only ever receives a `userId`, a `type`, a `title`, and a `message`, already fully formed by whichever module is calling it. All business logic about *when* to notify and *what* to say lives in the calling module, not here.

---

## 2. Database Schema (Prisma)

```prisma
model Notification {
  id        String           @id @default(uuid())

  userId    String
  user      User             @relation(fields: [userId], references: [id])

  type      NotificationType
  title     String
  message   String
  isRead    Boolean          @default(false)

  createdAt DateTime         @default(now())

  @@index([userId, isRead])
}

enum NotificationType {
  BOOKING_UPDATE
  VENUE_APPROVAL
  OFFER
  SYSTEM
}
```

> This is the **entire schema** for this module — one table, one enum. `userId` is the only foreign key anywhere in this model; there is deliberately no `venueId`, `bookingId`, or any other reference to the thing that triggered the notification. The calling module is responsible for writing a `title`/`message` that's already meaningful on its own (e.g. "Your venue 'Lagoona Beach Resort' has been approved", not just "Approved") — this module stores and returns exactly what it's given, with no enrichment.

> `@@index([userId, isRead])` exists because the two queries this module ever runs are "all of this user's notifications" and "this user's unread count" — both filter on exactly these two columns together.

---

## 3. API Endpoints

All endpoints versioned under `/api/v1/`.

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/api/v1/notifications` | List current user's notifications + unread count | Yes |
| PATCH | `/api/v1/notifications/:id/read` | Mark one notification as read | Yes (must belong to the requesting user) |
| PATCH | `/api/v1/notifications/read-all` | Mark all of the current user's notifications as read | Yes |

> There is no public `POST /notifications` endpoint. Notifications are never created via an HTTP request from a client — they only ever come from another backend module calling `NotificationService.create(...)` directly in code. Exposing creation over HTTP would mean any authenticated user could spam arbitrary notifications to themselves or, worse, to others if the endpoint were ever mis-scoped — there is no legitimate frontend use case for it, so it simply doesn't exist.

---

## 4. Request / Response Contracts

### GET `/api/v1/notifications`

```jsonc
{
  "unreadCount": 3,
  "items": [
    {
      "id": "uuid",
      "type": "VENUE_APPROVAL",
      "title": "Venue Approved",
      "message": "Your venue 'Lagoona Beach Resort' has been approved.",
      "isRead": false,
      "createdAt": "2026-06-18T10:00:00Z"
    },
    {
      "id": "uuid",
      "type": "BOOKING_UPDATE",
      "title": "Booking Confirmed",
      "message": "Your booking for Lagoona Beach Resort is confirmed. You can cancel for a full refund until 22 Jun, 10:00 AM.",
      "isRead": true,
      "createdAt": "2026-06-15T14:22:00Z"
    }
  ]
}
```

> Sorted newest-first, no pagination in Phase 1 — see Open Questions for when this would need to change.

### PATCH `/api/v1/notifications/:id/read`

```jsonc
// Response 200
{ "message": "Notification marked as read" }

// Response 404 (doesn't exist, or belongs to a different user)
{ "statusCode": 404, "message": "Notification not found" }
```

### PATCH `/api/v1/notifications/read-all`

```jsonc
// Response 200
{ "message": "All notifications marked as read", "updated": 3 }
```

---

## 5. The Public Service Method (create)

This is the only method other modules ever call, and it is intentionally the simplest possible interface — a thin wrapper around a single `INSERT`:

```typescript
NotificationService.create({
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
}): Promise<void>
```

**Confirmed call sites already documented elsewhere in this system**, shown here for traceability rather than as new information:

| Calling Module | Example Call | Trigger |
|---|---|---|
| Venue *(via Admin)* | `create({ userId: ownerId, type: 'VENUE_APPROVAL', title: 'Venue Approved', message: "Your venue '...' has been approved." })` | Admin approves/rejects a venue |
| Booking | `create({ userId, type: 'BOOKING_UPDATE', title: 'Booking Confirmed', message: '...' })` | Payment confirmed, refunded, or cancelled |
| Auth *(via Venue)* | `create({ userId, type: 'SYSTEM', title: "You're now a Venue Owner", message: '...' })` | First venue created, role auto-upgraded |
| Admin | `create({ userId: owner.id, type: 'VENUE_APPROVAL', ... })` | Approve/reject action |

> The method returns `Promise<void>`, not the created row. Callers never need the notification's own `id` — they fire it and move on. If a caller's own operation (e.g. confirming a booking) succeeds but the notification write fails for some reason, that failure must never roll back or block the caller's primary action — see Section 11.

---

## 6. Real-Time Delivery — Polling, Not Sockets

This module deliberately does not use WebSockets, Server-Sent Events, or any push mechanism. The frontend's bell icon updates by **polling** `GET /notifications` on an interval (e.g. every 30-60 seconds) or on page focus/navigation.

**Why this was decided, restated from earlier discussion for this LLD's own record:**

- A WebSocket gateway is a second real-time system layered on top of a single NestJS monolith that doesn't otherwise need one — Booking's Upstash-based locking is the only place real-time correctness genuinely matters (preventing double-booking), and that's already solved without sockets
- The cost of being "instant" via sockets is a persistent connection per client, reconnect handling, and a second thing that can silently fail — for a 30-60 second delay on a notification bell, that infrastructure cost isn't justified
- If the platform later needs genuinely instant delivery (e.g. live chat, which doesn't exist in this system at all), that would be the point to introduce sockets — not for a bell icon

---

## 7. NestJS Module Structure

```
notification/
├── notification.module.ts
├── notification.controller.ts
├── notification.service.ts
└── dto/
    └── create-notification.dto.ts
```

> `create-notification.dto.ts` validates the shape of `NotificationService.create()`'s input even though it's never called over HTTP — internal type safety, not request validation, since `class-validator` decorators are still useful for catching a malformed call from another module at development time.

---

## 8. Cross-Module Calls

This table is intentionally one row, because the relationship only ever runs in one direction:

| Direction | Call | Purpose |
|---|---|---|
| *(Auth, Venue, Booking, Admin)* → Notification | `NotificationService.create({ userId, type, title, message })` | Every notification in the system, regardless of origin, goes through this single method |

> Notification never calls into any other module. It has no need to look up a venue's name, a booking's price, or anything else — the caller has already composed a complete, human-readable `title`/`message` before calling `create()`. This keeps Notification dependency-free in one direction, which is precisely what makes it safe for every other module to depend on it without creating a circular import.

---

## 9. Validation Rules (DTOs)

| Field | Rule |
|---|---|
| `userId` (internal, via create) | Required, must reference an existing `User.id` — enforced by the schema's foreign key, not re-validated in application code beyond that |
| `type` (internal, via create) | Required, must be a valid `NotificationType` enum value |
| `title` (internal, via create) | Required, non-empty, max 150 characters |
| `message` (internal, via create) | Required, non-empty, max 500 characters |

---

## 10. Sequence Flows

### A Notification Being Created (generic, any caller)

```
[Some other module's service] -> NotificationService.create({ userId, type, title, message })
NotificationService -> PostgreSQL: INSERT INTO Notification (...)
NotificationService -> [calling module]: returns (void), call site continues
```

### User Views Their Notifications

```
User -> Frontend: opens notification bell / navigates to notifications page
Frontend -> Backend: GET /api/v1/notifications
Backend -> PostgreSQL: SELECT * FROM Notification WHERE userId = ? ORDER BY createdAt DESC
Backend -> PostgreSQL: COUNT(*) WHERE userId = ? AND isRead = false
Backend -> Frontend: 200 { unreadCount, items }
Frontend -> User: renders list, bell badge shows unreadCount
```

### Marking as Read

```
User -> Frontend: taps a notification
Frontend -> Backend: PATCH /api/v1/notifications/:id/read
Backend -> PostgreSQL: check Notification.userId === requesting user
   -> if not: 404 (never reveal that a notification belonging to someone else exists)
Backend -> PostgreSQL: UPDATE Notification SET isRead = true WHERE id = ?
Backend -> Frontend: 200
```

---

## 11. Edge Cases Handled

| Case | Behaviour |
|---|---|
| `NotificationService.create()` fails (e.g. transient DB error) while the caller's main operation already succeeded | The notification write must be fire-and-forget from the caller's perspective — a failed notification must never roll back a confirmed booking, an approved venue, or any other primary action. The caller logs the failure but does not propagate it as an error to the end user |
| User tries to mark someone else's notification as read | `404`, not `403` — deliberately does not confirm the notification exists at all to a user who doesn't own it |
| User has zero notifications | `200` with `unreadCount: 0, items: []`, not an error |
| `read-all` is called when there are already zero unread notifications | `200 { updated: 0 }` — not an error, simply nothing to do |
| Two devices/tabs open, one marks a notification read | The other tab shows it as read on its next poll cycle (30-60s later), not instantly — an accepted tradeoff of the polling approach (Section 6) |

---

## 12. Out of Scope (Phase 1)

- Push notifications (mobile push, browser push) — explicitly Phase 2 per the original PRD
- WhatsApp notifications — explicitly Phase 2 per the original PRD
- Real-time delivery via WebSockets/SSE — polling only, see Section 6
- Notification preferences/settings (e.g. "don't notify me about offers") — no per-user configuration exists; every notification a calling module sends is always delivered and always stored
- Grouping or de-duplication of similar notifications (e.g. collapsing multiple booking updates into one entry) — each `create()` call always produces exactly one new row
- Deleting notifications — users can mark as read, but there is no delete endpoint; old notifications simply accumulate in Phase 1
- Pagination on `GET /notifications` — returns the full list every time; acceptable at Phase 1's expected notification volume per user

---

## 13. Decision Log

| Date | Decision | Reasoning |
|---|---|---|
| 2026-06-19 *(originally decided during Auth module design)* | Notification is a standalone module, not part of Auth, Venue, Booking, or Admin | All four other modules need to trigger notifications; none of them should own it, or the others would need to import a module that isn't conceptually theirs |
| 2026-06-19 | `Notification.userId -> User.id` is the only schema relation anywhere | Every other piece of context (which venue, which booking) is baked into the title/message text by the caller — this module never needs a venueId or bookingId foreign key |
| 2026-06-19 | Other modules call `NotificationService.create()` directly, not via RabbitMQ or an event emitter | All modules run in the same NestJS process; a message queue solves a distributed-systems problem this monolith doesn't have |
| 2026-06-22 | Real-time delivery via polling, not WebSockets | A 30-60s delay on a notification bell doesn't justify a persistent-connection infrastructure layer; sockets would be the right call for something like live chat, which doesn't exist here |
| 2026-06-22 | No `POST /notifications` endpoint exposed over HTTP | There is no legitimate frontend use case for a client to create its own notification; only backend modules calling `create()` directly should ever produce one |
| 2026-06-22 | A failed `create()` call must never roll back or block the caller's primary action | Notifications are a side effect of something important (a booking, an approval) — they should never be allowed to undermine the thing they're describing |

---

## 14. Open Questions

- [ ] At what notification-count-per-user does the lack of pagination on `GET /notifications` become a real problem? Worth a rough estimate before launch, even if not built now.
- [ ] Should `read-all` exist as a single bulk action (current design), or should the frontend just call `/:id/read` in a loop? Current design chosen for efficiency (one query vs. N), but worth confirming the frontend actually wants a single "mark all read" button.
- [ ] If/when push notifications are built in Phase 2, will they be triggered from inside this module's `create()` method (so every notification automatically gets both in-app and push delivery), or from a separate path in each calling module? Worth deciding before Phase 2 starts, not during.