# Admin Module — Low Level Design

**Project:** Venue Booking Platform
**Module:** 4 of 6 — Admin
**Status:** ✅ Approved for Phase 1
**Version:** 1.1
**Last Updated:** 2026-06-22

---

## Page Tree

- [1. Scope](#1-scope)
- [2. The Admin Account (Phase 1 Assumption)](#2-the-admin-account-phase-1-assumption)
- [3. Database Schema](#3-database-schema-prisma)
- [4. API Endpoints](#4-api-endpoints)
- [5. Request / Response Contracts](#5-request--response-contracts)
- [6. Dashboard Metrics Logic](#6-dashboard-metrics-logic)
- [7. Venue Approval Flow](#7-venue-approval-flow)
- [7a. Monitoring Lists (All Venues, All Users)](#7a-monitoring-lists-all-venues-all-users)
- [8. NestJS Module Structure](#8-nestjs-module-structure)
- [9. Cross-Module Calls](#9-cross-module-calls)
- [10. Validation Rules (DTOs)](#10-validation-rules-dtos)
- [11. Sequence Flows](#11-sequence-flows)
- [12. Edge Cases Handled](#12-edge-cases-handled)
- [13. Out of Scope (Phase 1)](#13-out-of-scope-phase-1)
- [14. Decision Log](#14-decision-log)
- [15. Open Questions](#15-open-questions)

---

## 1. Scope

This module covers three things: a **dashboard** showing aggregate platform counts (total bookings, venues, users), the **venue approval queue** (viewing pending venues, approving or rejecting them with a rejection reason surfaced back to the owner), and **read-only monitoring lists** for all venues and all users on the platform.

> 🔗 **Cross-module dependency:** This module calls `VenueService.updateStatus(venueId, status, rejectionNote?)` (owned by Venue) to approve/reject — it does not write to the `Venue` table directly. Dashboard counts and the monitoring lists are read-only queries against `Booking` (Booking module), `Venue` (Venue module), and `User` (Auth module) — this module owns none of that data, it only reads and summarizes it.

> 📦 **Module boundary note:** This remains one of the thinner modules in the system. There is no admin-management feature and no moderation queue beyond venue approval — see Section 2 and Section 13 for what's explicitly excluded and why.

---

## 2. The Admin Account (Phase 1 Assumption)

> This section states an assumption, not a feature — there is no code here, only a clarification of how the one Admin account comes to exist.

As already established in the Authentication Module LLD, the `ADMIN` role is **seeded manually in the database, not self-registerable through any public endpoint.** For Phase 1, this is taken further: there is exactly **one hardcoded Admin account**, created once via a database seed script before the app is deployed, with no in-app mechanism to create, promote, or manage additional Admin accounts.

**What this deliberately does NOT include:**
- No `POST /admin/invite` or "promote user to admin" endpoint
- No admin-management UI screen
- No audit log of who granted Admin access (there is only ever one, created outside the app)

This module assumes that account already exists and simply guards its own endpoints with the existing `RolesGuard` + `@Roles(Role.ADMIN)` pattern already defined in Authentication — it does nothing to create or manage that account.

---

## 3. Database Schema (Prisma)

**This module owns no models of its own.**

There is no `AdminAction`, `AuditLog`, or similar table in Phase 1 — every piece of data the Admin dashboard and approval queue need already exists in `User` (Auth), `Venue` (Venue), and `Booking` (Booking). The only schema element this module's existence depends on is the `rejectionNote` field already present on `Venue`:

```prisma
// Defined in the Venue module's schema, referenced here, not duplicated
model Venue {
  // ...
  status        VenueStatus  @default(PENDING)
  rejectionNote String?      // populated only if status = REJECTED — surfaced to the owner
  // ...
}
```

> `rejectionNote` was originally reserved but deliberately left unsurfaced when the Venue module was first designed. This Admin module is what actually wires it up — the field always existed, but nothing read or wrote it meaningfully until now.

---

## 4. API Endpoints

All endpoints versioned under `/api/v1/`. Every endpoint in this module requires `@Roles(Role.ADMIN)`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/admin/dashboard` | Aggregate counts: total bookings, total venues, total users |
| GET | `/api/v1/admin/venues/pending` | List venues awaiting approval |
| PATCH | `/api/v1/admin/venues/:id/approve` | Approve a pending venue |
| PATCH | `/api/v1/admin/venues/:id/reject` | Reject a pending venue, with a reason |
| GET | `/api/v1/admin/venues?status=&page=&limit=` | List/browse **all** venues, optionally filtered by status |
| GET | `/api/v1/admin/users?page=&limit=` | List/browse **all** users on the platform |

> Both monitoring endpoints are plain paginated reads — no new tables, no new cross-module writes. They reuse the same `Venue`/`User` rows everything else already reads from; this module just exposes an Admin-only view over them.

---

## 5. Request / Response Contracts

### GET `/api/v1/admin/dashboard`

```jsonc
{
  "totalBookings": 184,
  "totalVenues": 42,
  "totalUsers": 310,
  "pendingVenueApprovals": 5
}
```

> All four numbers are computed fresh on every request via simple `COUNT()` queries — see Section 6 for why nothing here is cached or pre-aggregated in Phase 1.

### GET `/api/v1/admin/venues/pending`

```jsonc
{
  "items": [
    {
      "id": "uuid",
      "name": "Lagoona Beach Resort",
      "venueType": "RESORT",
      "city": "Kochi",
      "ownerName": "Anjali Menon",
      "ownerEmail": "owner@example.com",
      "createdAt": "2026-06-20T10:00:00Z"
    }
  ]
}
```

### PATCH `/api/v1/admin/venues/:id/approve`

```jsonc
// Response 200
{ "message": "Venue approved" }

// Response 400 (venue is not currently PENDING)
{ "statusCode": 400, "message": "Only pending venues can be approved" }
```

### PATCH `/api/v1/admin/venues/:id/reject`

```jsonc
// Request
{ "reason": "Photos are too blurry to verify the venue's actual capacity. Please re-upload clearer images." }

// Response 200
{ "message": "Venue rejected" }

// Response 400 (missing reason, or venue not PENDING)
{ "statusCode": 400, "message": "A reason is required to reject a venue" }
```

### GET `/api/v1/admin/venues?status=&page=&limit=`

```jsonc
// Query params (all optional) — status: PENDING | APPROVED | REJECTED, page, limit (default limit: 20)

// Response 200
{
  "total": 42,
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": "uuid",
      "name": "Lagoona Beach Resort",
      "venueType": "RESORT",
      "city": "Kochi",
      "status": "APPROVED",
      "ownerName": "Anjali Menon",
      "ownerEmail": "owner@example.com",
      "createdAt": "2026-06-15T10:00:00Z"
    }
  ]
}
```

> Without a `status` filter, this returns venues of **every** status — `PENDING`, `APPROVED`, and `REJECTED` alike — since this is a general browsing view, unlike `GET /admin/venues/pending` which is always filtered to `PENDING` only.

### GET `/api/v1/admin/users?page=&limit=`

```jsonc
// Response 200
{
  "total": 310,
  "page": 1,
  "limit": 20,
  "items": [
    {
      "id": "uuid",
      "name": "Anjali Menon",
      "email": "anjali@example.com",
      "phone": "+91...",
      "role": "VENUE_OWNER",
      "isActive": true,
      "createdAt": "2026-05-01T08:00:00Z"
    }
  ]
}
```

> Returns the same `User` fields already defined in the Authentication module — this endpoint does not introduce any new user-facing fields, it just exposes the existing `User` table as a paginated, Admin-only list.

---

## 6. Dashboard Metrics Logic

- All four dashboard numbers (`totalBookings`, `totalVenues`, `totalUsers`, `pendingVenueApprovals`) are computed with plain `COUNT()` queries against existing tables, executed fresh on every request to `GET /admin/dashboard`.
- **No caching, no pre-aggregation, no scheduled job** to keep a running total. At Phase 1 scale (a single admin checking a dashboard occasionally), a live `COUNT()` is fast enough and avoids an entire class of "is this number stale" bugs that a cached/pre-computed counter would introduce.
- `totalBookings` counts **all** `Booking` rows regardless of status (`PENDING_PAYMENT`, `CONFIRMED`, `EXPIRED`, `REFUNDED`, `CANCELLED`) — this is a simple total count, not filtered to "successful" bookings only, since the stated requirement was just "how many bookings came total."

---

## 7. Venue Approval Flow

- Only venues with `status = PENDING` appear in `GET /admin/venues/pending` — once approved or rejected, a venue drops out of this list automatically (it's a live query filtered by status, not a separate queue table).
- **Approve:** sets `Venue.status = APPROVED`. The Venue module's existing rule (editing an `APPROVED` venue resets it to `PENDING`) means a venue can cycle through this flow multiple times if the owner makes changes after approval — that's expected, not a bug.
- **Reject:** requires a non-empty `reason` string in the request body, which is stored directly into `Venue.rejectionNote` via the existing `VenueService.updateStatus(venueId, 'REJECTED', reason)` call. The owner can then see this reason on their own venue management page (a Venue-module concern, not duplicated here).
- After either action, this module calls `NotificationService.create(...)` to inform the owner — same direct-call pattern used everywhere else in this system, no schema relation involved.

---

## 7a. Monitoring Lists (All Venues, All Users)

- `GET /admin/venues` and `GET /admin/users` are **plain paginated reads**, no different in kind from any other paginated list endpoint already built in this system (e.g. Venue module's search results) — just gated behind `@Roles(Role.ADMIN)` instead of being public.
- `GET /admin/venues` accepts an optional `status` filter; with no filter, it returns venues of every status, which is the one meaningful difference from the public-facing `GET /venues` search (Venue module), which only ever returns `APPROVED` venues regardless of filters. Admin needs to see everything, including rejected and still-pending listings, in one browsable view.
- `GET /admin/users` returns the same fields already defined on `User` in the Authentication module — no new fields are introduced here, this is purely a read-only Admin-facing view over the existing table.
- Neither endpoint supports free-text search or sorting in Phase 1 — just pagination and (for venues) a status filter. Search/sort can be added later without any schema change, purely as query-parameter and query-logic additions.

---

## 8. NestJS Module Structure

```
admin/
├── admin.module.ts
├── admin.controller.ts
├── admin.service.ts
└── dto/
    └── reject-venue.dto.ts
```

> No sub-folders — this module is small enough that one controller and one service cover everything. `admin.service.ts` contains the dashboard count queries and calls into `VenueService` for approval/rejection; it does not duplicate any Venue logic itself.

---

## 9. Cross-Module Calls

| Direction | Call | Purpose |
|---|---|---|
| Admin → Venue | `VenueService.updateStatus(venueId, 'APPROVED')` | Approve a pending venue |
| Admin → Venue | `VenueService.updateStatus(venueId, 'REJECTED', reason)` | Reject a pending venue, storing the reason in `rejectionNote` |
| Admin → Venue | *(read-only)* `COUNT(*) FROM Venue` | Dashboard's `totalVenues` |
| Admin → Venue | *(read-only, paginated)* `SELECT * FROM Venue [WHERE status = ?]` | `GET /admin/venues` monitoring list |
| Admin → Booking | *(read-only)* `COUNT(*) FROM Booking` | Dashboard's `totalBookings` |
| Admin → Auth | *(read-only)* `COUNT(*) FROM User` | Dashboard's `totalUsers` |
| Admin → Auth | *(read-only, paginated)* `SELECT * FROM User` | `GET /admin/users` monitoring list |
| Admin → Notification | `NotificationService.create({ userId: owner.id, type: 'VENUE_APPROVAL', ... })` | Inform the owner of the approval/rejection decision |

---

## 10. Validation Rules (DTOs)

| Field | Rule |
|---|---|
| `reason` (reject) | Required, non-empty string, max 500 characters |
| `status` (venue monitoring list, query param) | Optional, must be one of `PENDING`, `APPROVED`, `REJECTED` if provided |
| `page` / `limit` (both monitoring lists) | Optional, positive integers; `limit` defaults to 20, capped at 100 |

---

## 11. Sequence Flows

### Approve a Venue

```
Admin → Frontend: clicks "Approve" on a pending venue
Frontend → Backend: PATCH /api/v1/admin/venues/:id/approve
Backend → Backend: check Venue.status === PENDING
   → if not: 400
Backend → VenueService: updateStatus(venueId, 'APPROVED')
Backend → NotificationService: create(ownerId, VENUE_APPROVAL, "Your venue has been approved")
Backend → Frontend: 200 { message: "Venue approved" }
```

### Reject a Venue

```
Admin → Frontend: enters a reason, clicks "Reject"
Frontend → Backend: PATCH /api/v1/admin/venues/:id/reject { reason }
Backend → Backend: validate reason is non-empty, check Venue.status === PENDING
   → if either fails: 400
Backend → VenueService: updateStatus(venueId, 'REJECTED', reason)
Backend → NotificationService: create(ownerId, VENUE_APPROVAL, "Your venue was rejected: {reason}")
Backend → Frontend: 200 { message: "Venue rejected" }
```

---

## 12. Edge Cases Handled

| Case | Behaviour |
|---|---|
| Admin tries to approve/reject a venue that's already `APPROVED` or `REJECTED` | `400` — only `PENDING` venues can be acted on |
| Reject request submitted with an empty or missing `reason` | `400` — rejection always requires a reason, no silent rejections |
| Non-Admin user calls any `/admin/*` endpoint | `403` — enforced by the existing `RolesGuard` + `@Roles(Role.ADMIN)` pattern, no new guard logic needed |
| Owner edits and resubmits a previously rejected venue | Re-enters `PENDING` automatically via Venue module's existing edit logic, reappearing in this module's pending queue with no special handling required here |

---

## 13. Out of Scope (Phase 1)

- **Admin account management** — no invite flow, no promote-to-admin UI, no multi-admin support (see Section 2)
- **Audit logging of admin actions** (who approved/rejected what, when) — would need its own table; not built since there's only one Admin account and no dispute-resolution need yet
- **Dashboard charts/trends over time** — only current-moment counts, no historical graphs or time-series data
- **Cached/pre-aggregated dashboard metrics** — live `COUNT()` queries are sufficient at this scale (see Section 6)
- **Free-text search or sorting on the monitoring lists** — pagination and a status filter (venues only) are sufficient for Phase 1; can be added later without a schema change

---

## 14. Decision Log

| Date | Decision | Reasoning |
|---|---|---|
| 2026-06-22 | Single hardcoded Admin account, manually seeded, no admin-management UI | This action happens once, before deployment — building promotion/invite logic for a one-time setup step is unjustified complexity for Phase 1 |
| 2026-06-22 | Dashboard scope narrowed to simple aggregate counts only | The explicit requirement was "show total bookings" — extended lightly to venues/users as the same pattern, but not expanded into full analytics, trends, or charts |
| 2026-06-22 | "Monitor all venues/users" initially narrowed to just the pending-approval queue, then **reinstated** as simple paginated read-only lists | Originally deferred for being underspecified, but reconsidered once confirmed it's just two plain paginated reads with no new schema or cross-module writes — genuinely low effort, so there was no real reason to keep deferring it |
| 2026-06-22 | Reactivated `rejectionNote` — surfaced to the owner now, not deferred to Phase 2 | Reconsidered now that the Admin module is being built properly; the field already existed in Venue's schema and wiring it up is low effort, so deferring it further had no real benefit |
| 2026-06-22 | No caching or pre-aggregation for dashboard counts | A single Admin checking occasionally doesn't justify the staleness risk and complexity a cached counter would introduce |
| 2026-06-22 | No `AdminAction`/audit log table | Only one Admin account exists; there's no second party to dispute or audit against yet |

---

## 15. Open Questions

- [ ] If the platform later needs more than one Admin (e.g. regional moderators when expanding beyond Kerala), should that trigger building proper admin-management, or is manual DB seeding still acceptable at that point too?
- [ ] Should `pendingVenueApprovals` on the dashboard link directly to the approval queue, or is it purely informational? (Frontend UX decision, no backend impact either way.)
- [ ] Confirm whether rejected venues that are later resubmitted should notify the Admin somehow (e.g. "5 pending" badge), or whether the Admin is expected to just check the queue periodically.