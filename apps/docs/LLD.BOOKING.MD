# Booking Module — Low Level Design

**Project:** Venue Booking Platform
**Module:** 3 of 7 — Booking
**Status:** ✅ Approved for Phase 1
**Version:** 3.1
**Last Updated:** 2026-06-21

---

## Page Tree

- [1. Scope](#1-scope)
- [2. Database Schema](#2-database-schema-prisma)
- [3. Redis Keys (Upstash)](#3-redis-keys-upstash)
- [4. API Endpoints](#4-api-endpoints)
- [5. Request / Response Contracts](#5-request--response-contracts)
- [6. The All-or-Nothing Multi-Slot Booking Flow](#6-the-all-or-nothing-multi-slot-booking-flow)
- [7. Why the Booking Row Exists Before Payment Completes](#7-why-the-booking-row-exists-before-payment-completes)
- [8. Grace-Period Cancellation Policy](#8-grace-period-cancellation-policy)
- [9. Reliability & Integrity Safeguards](#9-reliability--integrity-safeguards)
- [10. NestJS Module Structure](#10-nestjs-module-structure)
- [11. Cross-Module Calls](#11-cross-module-calls)
- [12. Validation Rules (DTOs)](#12-validation-rules-dtos)
- [13. Sequence Flows](#13-sequence-flows)
- [14. Edge Cases Handled](#14-edge-cases-handled)
- [15. Out of Scope (Phase 1)](#15-out-of-scope-phase-1)
- [16. Decision Log](#16-decision-log)
- [17. Open Questions](#17-open-questions)
- [18. Corresponding Changes Applied to the Venue Module](#18-corresponding-changes-applied-to-the-venue-module)

---

## 1. Scope

This module covers **multi-slot booking creation** — a single booking can contain one or more (slot pricing tier + date) selections, each priced independently and locked atomically — the all-or-nothing lock-first payment flow (Upstash Redis), Razorpay payment integration and webhook handling, booking confirmation, a narrow grace-period cancellation with automatic full refund, and booking history. It also performs the cross-module overlap check against the Venue module before allowing any booked slot to proceed, and includes the reliability/security safeguards needed for a production-correct payment flow (idempotency, webhook verification).

This module now natively supports **multi-day and multi-slot bookings as a single, self-service, single-payment transaction** — replacing the earlier approach of directing users to contact the venue owner manually for anything beyond a single day.

> 🔗 **Cross-module dependency:** For each booked slot in a booking, this module calls `VenueAvailabilityService.checkSlotAvailability()` and `computeOccupiedWindow()` (owned by Venue) before creating any lock. Pricing is no longer looked up by guest count — the user selects the exact `VenueSlotPricing` row (tier) they want, and this module reads that row directly by ID. On confirmation, cancellation, or refund, Booking calls `NotificationService.create(...)` directly — no schema relation, same pattern used everywhere else in this system.

> 📦 **Module boundary note:** Full cancellation-with-refund-policy (variable refund tiers based on days-before-event, owner-side cancellation, etc.) remains explicitly out of scope for Phase 1. What this module *does* implement is a narrower, policy-free grace-period cancellation — see Section 8.

---

## 2. Database Schema (Prisma)

```prisma
model Booking {
  id                    String         @id @default(uuid())

  userId                String
  user                  User           @relation(fields: [userId], references: [id])

  venueId               String
  venue                 Venue          @relation(fields: [venueId], references: [id])

  totalPrice            Decimal        @db.Decimal(10, 2)   // sum of all BookedSlot.slotPrice, snapshotted

  status                BookingStatus  @default(PENDING_PAYMENT)
  cancellationEligible  Boolean        // computed once at creation: true if EVERY booked slot's eventDate was >7 days away
  confirmedAt           DateTime?                 // set when status becomes CONFIRMED — anchors the cancel window
  cancelledAt           DateTime?

  razorpayOrderId       String?        @unique
  razorpayPaymentId     String?        @unique
  razorpayRefundId      String?        @unique

  slots                 BookedSlot[]

  createdAt             DateTime       @default(now())
  updatedAt              DateTime       @updatedAt

  @@index([userId])
  @@index([status])
}

model BookedSlot {
  id                 String            @id @default(uuid())

  bookingId          String
  booking            Booking           @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  slotPricingTierId  String
  slotPricingTier    VenueSlotPricing  @relation(fields: [slotPricingTierId], references: [id])

  eventDate          DateTime          @db.Date    // the specific date this booked slot covers
  occupiedFrom       DateTime                      // computed from the tier's slot template offsets + eventDate
  occupiedTo         DateTime

  slotPrice          Decimal           @db.Decimal(10, 2)   // copied from slotPricingTier.price at creation — permanent snapshot

  createdAt          DateTime          @default(now())

  @@index([slotPricingTierId, eventDate])
  @@index([occupiedFrom, occupiedTo])
}

enum BookingStatus {
  PENDING_PAYMENT   // all booked slot locks held, awaiting Razorpay
  CONFIRMED         // payment verified, all booked slot locks converted to permanent booking
  EXPIRED           // one or more locks expired before payment completed (user abandoned checkout)
  REFUNDED          // payment succeeded but at least one lock had expired — auto-refunded (system fallback)
  CANCELLED         // user-cancelled within the grace-period window — auto-refunded
}
```

> **Why `Booking` became a parent with `BookedSlot` children:** a booking is no longer tied to exactly one date — it can cover any number of (slot tier + date) selections in a single transaction, priced and paid for together. This is what makes genuine multi-day, multi-slot booking possible without resorting to multiple separate bookings or manual owner contact.

> **No `guestCount` field exists anywhere in this schema.** The owner-defined `VenueSlotPricing` tier the user selects (e.g. "401–1000 guests — ₹80,000") already encodes the guest range and the price together. The user picks the tier as a single unit, not a number that gets matched against tiers — so there is nothing left to store separately. See Decision Log.

> **`slotPrice` is a permanent snapshot**, copied from `VenueSlotPricing.price` at the moment the booked slot is created. It must never be recalculated from current pricing data later — not at confirmation, not at display time, not ever, even if the venue owner edits their tiers afterward (same principle as `totalPrice`, which is simply the sum of all booked slots' snapshotted prices).

> **`cancellationEligible` now requires every booked slot to qualify**, not just one. A multi-day booking is only eligible for the grace-period cancellation if **all** of its event dates are more than 7 days away at creation time — if even one booked slot's date is within 7 days, the entire booking is marked ineligible, since cancelling "most but not all" of a multi-day event isn't a coherent action.

---

## 3. Redis Keys (Upstash)

| Key Pattern | Value | TTL | Purpose |
|---|---|---|---|
| `slot-lock:{venueId}:{slotPricingTierId}:{eventDate}` | `bookingId` | 600s (10 min) | Holds one specific booked slot's slot+date during checkout; one key per booked slot, re-checked before confirming |
| `idempotency:{idempotencyKey}` | cached response body | 600s (10 min) | Prevents duplicate booking creation from retries/double-clicks |

> Note: the lock key now includes `slotPricingTierId` rather than `slotTemplateId`, since different tiers on the same slot template are still the same physical slot — locking must key off the actual bookable unit. Two different tiers on the *same* template for the *same* date should still conflict with each other (they represent the same physical slot/date), so the availability check (Section 6) treats all tiers belonging to the same `slotTemplateId` as mutually exclusive for a given date, even though the lock key itself is per-tier for simplicity of implementation.

---

## 4. API Endpoints

All endpoints versioned under `/api/v1/`.

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/v1/bookings` | Create a multi-slot booking + acquire all locks, returns one Razorpay order. Requires `Idempotency-Key` header | Yes |
| POST | `/api/v1/bookings/webhook/razorpay` | Razorpay webhook — signature-verified, confirms or refunds the entire booking | No (HMAC signature-verified) |
| POST | `/api/v1/bookings/:id/cancel-pending` | Release all booked slot locks early if user backs out before paying | Yes (must be the User who created this booking) |
| POST | `/api/v1/bookings/:id/cancel` | Grace-period cancellation of a CONFIRMED booking (all slots), with full refund | Yes (must be the User who created this booking) |
| GET | `/api/v1/bookings/my-bookings` | List current user's bookings, each with its slots | Yes |
| GET | `/api/v1/bookings/:id` | Get single booking detail, including all slots | Yes (must be the User who created this booking) |
| GET | `/api/v1/bookings/venue/:venueId` | List bookings for a venue (owner view), with slots | Yes (must be the Venue Owner who owns this venue) |

> ⚠️ **Naming clarification:** "owner of booking" in earlier drafts of this table meant *the User who created the booking* — not the Venue Owner. To avoid this exact ambiguity (especially since `VENUE_OWNER` is also a real role elsewhere in this system), the Auth column above spells out which "owner" is meant on every row. **Neither `cancel-pending` nor `cancel` ever requires Venue Owner approval** — both are fully automatic, user-initiated actions; the Venue Owner only receives a notification afterward, with no approval step in the flow.

---

## 5. Request / Response Contracts

### POST `/api/v1/bookings`

```jsonc
// Request headers
// Idempotency-Key: <client-generated UUID, one per distinct booking attempt>

// Request body — a 4-day wedding event, same tier each day
{
  "venueId": "uuid",
  "slots": [
    { "slotPricingTierId": "tier-uuid-A", "eventDate": "2026-07-10" },
    { "slotPricingTierId": "tier-uuid-A", "eventDate": "2026-07-11" },
    { "slotPricingTierId": "tier-uuid-A", "eventDate": "2026-07-12" },
    { "slotPricingTierId": "tier-uuid-A", "eventDate": "2026-07-13" }
  ]
}

// Request body — a single-day booking still works the same way, just one booked slot
{
  "venueId": "uuid",
  "slots": [
    { "slotPricingTierId": "tier-uuid-A", "eventDate": "2026-07-15" }
  ]
}

// Response 201 — every booked slot's date is more than 7 days away (cancellable)
{
  "bookingId": "uuid",
  "status": "PENDING_PAYMENT",
  "totalPrice": 180000,
  "lockExpiresIn": 600,
  "cancellationEligible": true,
  "cancellationPolicy": "You can cancel and get a full refund within 24 hours of booking. After that, this booking cannot be cancelled.",
  "slots": [
    { "eventDate": "2026-07-10", "slotPrice": 45000 },
    { "eventDate": "2026-07-11", "slotPrice": 45000 },
    { "eventDate": "2026-07-12", "slotPrice": 45000 },
    { "eventDate": "2026-07-13", "slotPrice": 45000 }
  ],
  "razorpayOrder": {
    "id": "order_xyz",
    "amount": 18000000,
    "currency": "INR",
    "keyId": "rzp_test_..."
  }
}

// Response 201 — at least one booked slot's date is 7 days or less away (not cancellable)
{
  "bookingId": "uuid",
  "status": "PENDING_PAYMENT",
  "totalPrice": 45000,
  "lockExpiresIn": 600,
  "cancellationEligible": false,
  "cancellationPolicy": "One or more of your selected dates is happening soon. This booking cannot be cancelled once confirmed — please confirm you want to proceed.",
  "slots": [ { "eventDate": "2026-07-25", "slotPrice": 45000 } ],
  "razorpayOrder": { "id": "order_xyz", "amount": 4500000, "currency": "INR", "keyId": "rzp_test_..." }
}

// Response 409 (one or more slots unavailable — entire request rejected, no locks acquired)
{
  "statusCode": 409,
  "message": "One or more selected dates are no longer available",
  "unavailableSlots": [ { "slotPricingTierId": "tier-uuid-A", "eventDate": "2026-07-12" } ]
}

// Response 200 (duplicate request, same Idempotency-Key as a prior request)
// Returns the EXACT same response body as the original request — no new booking created
```

> The frontend is responsible for letting a user browse a venue's available slot tiers per date (sourced from the Venue module's availability endpoint) and assembling the `slots` array from what the user actually selects — this module does not expose a "search" or "what's available" capability itself; it only validates and processes the exact slots submitted to it.

### POST `/api/v1/bookings/webhook/razorpay`

```jsonc
// Razorpay sends payment.captured event, with an X-Razorpay-Signature header
// Backend response is always 200 (Razorpay requirement) — outcome is internal

// If signature verification fails: request is rejected with 400 BEFORE
// any Booking row or lock is touched — see Section 9.2

// On valid signature, internally results in one of:
// - Booking status -> CONFIRMED, confirmedAt set, ALL booked slot locks deleted
// - Booking status -> REFUNDED, Razorpay refund triggered, at least one lock had expired
```

### POST `/api/v1/bookings/:id/cancel-pending`

```jsonc
// Response 200
{ "message": "Booking cancelled before payment, all selected dates released" }

// Response 400 (already paid / wrong status)
{ "statusCode": 400, "message": "This booking is no longer pending payment" }
```

### POST `/api/v1/bookings/:id/cancel`

```jsonc
// Response 200
{ "message": "Booking cancelled, full refund initiated", "refundId": "rfnd_xyz" }

// Response 400 (outside grace window, or any booked slot was within 7 days at booking time)
{ "statusCode": 400, "message": "This booking can no longer be cancelled" }
```

### GET `/api/v1/bookings/my-bookings`

```jsonc
{
  "items": [
    {
      "id": "uuid",
      "venueName": "Lagoona Beach Resort",
      "totalPrice": 180000,
      "status": "CONFIRMED",
      "canCancel": true,
      "cancelDeadline": "2026-06-22T10:00:00Z",
      "slots": [
        { "eventDate": "2026-07-10", "slotLabel": "Full Wedding Slot (incl. kitchen prep)", "slotPrice": 45000 },
        { "eventDate": "2026-07-11", "slotLabel": "Full Wedding Slot (incl. kitchen prep)", "slotPrice": 45000 },
        { "eventDate": "2026-07-12", "slotLabel": "Full Wedding Slot (incl. kitchen prep)", "slotPrice": 45000 },
        { "eventDate": "2026-07-13", "slotLabel": "Full Wedding Slot (incl. kitchen prep)", "slotPrice": 45000 }
      ]
    }
  ]
}
```

> `canCancel` is computed as `booking.cancellationEligible AND (now() - confirmedAt <= BOOKING_POLICY.cancellationWindowHours)`. `cancelDeadline` is `confirmedAt + cancellationWindowHours`. Both apply to the booking as a whole — there is no partial cancellation of individual slots within a multi-day booking in Phase 1.

---

## 6. The All-or-Nothing Multi-Slot Booking Flow

```
User → Frontend: Browse venue, select one or more (slotPricingTierId + eventDate) pairs
Frontend → Backend: POST /api/v1/bookings  (with Idempotency-Key header, slots[])

Backend → Redis: GET idempotency:{key}
   → if found: return the cached response immediately, stop here (no duplicate processing)

Backend → FOR EACH booked slot in the request:
   → VenueAvailabilityService.checkSlotAvailability(venueId, slotPricingTierId, eventDate)
   → IF ANY booked slot is unavailable:
        → 409, list which booked slots failed, stop here — NO locks acquired for any booked slot

Backend → FOR EACH booked slot, IN ORDER:
   → Redis: SET slot-lock:{venueId}:{slotPricingTierId}:{eventDate} = bookingId, EX 600, NX
   → IF a lock acquisition fails partway through:
        → immediately DEL every lock already acquired earlier in this same loop
        → 409 "One or more selected dates are no longer available", stop here

Backend → FOR EACH booked slot (now that all locks are held):
   → VenueAvailabilityService.computeOccupiedWindow(slotTemplateId, eventDate)
   → read slotPrice directly from the VenueSlotPricing row referenced by slotPricingTierId

Backend → Backend: cancellationEligible = TRUE only if EVERY booked slot's (eventDate - now() > 7 days)
Backend → Backend: totalPrice = sum of all booked slots' slotPrice

Backend → PostgreSQL: insert Booking (status: PENDING_PAYMENT, totalPrice, cancellationEligible)
Backend → PostgreSQL: insert one BookedSlot row per booked slot
Backend → Razorpay: create ONE order for totalPrice
Backend → Redis: SET idempotency:{key} = response, EX 600
Backend → Frontend: 201 { bookingId, razorpayOrder, lockExpiresIn: 600, cancellationEligible, cancellationPolicy, slots }

Frontend → User: Razorpay checkout opens once, for the full total
User → Razorpay: completes payment (takes anywhere from seconds to several minutes)

Razorpay → Backend: webhook POST /bookings/webhook/razorpay (payment.captured)

Backend → Backend: verify X-Razorpay-Signature against raw body using RAZORPAY_WEBHOOK_SECRET
   → if invalid: 400, stop here — no Booking row or lock touched

Backend → FOR EACH booked slot on this booking:
   → Redis: GET slot-lock:{venueId}:{slotPricingTierId}:{eventDate}
   → IF ANY booked slot's lock no longer exists or belongs to a different booking:
        → PostgreSQL: Booking.status = REFUNDED (entire booking, not just that booked slot)
        → Razorpay: trigger full refund via refund API
        → NotificationService.create(userId, BOOKING_UPDATE, "Payment refunded — one of your selected dates is no longer available")
        → stop here
   → IF every booked slot's lock is confirmed valid:
        → PostgreSQL: Booking.status = CONFIRMED, confirmedAt = now()
        → Redis: DEL every booked slot's lock key
        → NotificationService.create(userId, BOOKING_UPDATE, "Booking Confirmed" [+ cancellation deadline if eligible])
```

---

## 7. Why the Booking Row Exists Before Payment Completes

Creating the `Booking` row and all of its `BookedSlot` rows at `PENDING_PAYMENT` (not waiting until payment succeeds) serves two purposes:

- Gives the webhook handler something concrete to update (`bookingId` is already known, stored as the value of every booked slot's Redis lock)
- If a user abandons checkout entirely, the rows still exist with status `PENDING_PAYMENT` — a scheduled cleanup job (or a check on next availability query) can mark the booking `EXPIRED` once its locks' TTL has clearly passed, keeping booking history accurate rather than silently vanishing

---

## 8. Grace-Period Cancellation Policy

A narrow, **policy-free** cancellation exists in Phase 1 — distinct from the full cancellation-with-refund-tiers feature that remains deferred to Phase 2. It applies to the booking **as a whole**, not to individual slots.

### The rule

A `CONFIRMED` booking can be cancelled, with an automatic **full** refund of `totalPrice`, only if **both** conditions hold:

1. **`cancellationEligible === true`** — decided once, at booking creation, requiring **every** booked slot's `eventDate - now() > 7 days`
2. **Within the cancellation window since `confirmedAt`** — currently `24 hours`, read from a single config constant, not hardcoded inline

If either condition fails, cancellation is not permitted for the booking — there is no partial refund tier, no per-booked-slot cancellation, no owner override, no exception path in Phase 1.

### Why a multi-day booking needs ALL slots to qualify, not just one

Since a multi-day booking is paid for and confirmed as a single transaction, allowing cancellation if *any one* booked slot qualifies would let a user cancel an entire 4-day booking — including days that are imminent — just because one of the four happened to be far enough away. Requiring every booked slot to independently satisfy the 7-day threshold keeps the policy's original intent intact: cancellation should never be available for an event that's happening soon, regardless of how it's bundled.

### Why eligibility is decided once, upfront — not re-checked at cancel time

The 7-day condition only ever moves in one direction per booked slot: once a booked slot's event date is within 7 days, it can never become "more than 7 days away" again, because time only moves forward. This means the booking-level `cancellationEligible` flag, once computed, remains correct for the booking's entire lifetime — no need to recompute it against every booked slot's `eventDate` every time someone checks. This also lets eligibility be **disclosed to the user immediately**, on the same screen where they're about to pay — not discovered only if they later try to cancel.

### Worked examples

| Lines' event dates at booking time | `cancellationEligible` | Cancelling at | Allowed? | Why |
|---|---|---|---|---|
| July 10, 11, 12, 13 (all 20+ days away) | `true` | Within 24hrs of confirmation | ✅ Yes | Every booked slot eligible, and within the window |
| July 10, 11, 12, 13 (all 20+ days away) | `true` | 2 days after confirmation | ❌ No | Eligible, but window has passed |
| July 10 (20 days away), July 25 (within 7 days at booking time) | `false` | Any time | ❌ No | One booked slot fails the threshold → entire booking ineligible |
| Single booked slot, 5 days away | `false` | Any time | ❌ No | Never eligible — locked in at booking time |

> Note: slots within the same booking are not required to be consecutive dates — a user could in principle select non-adjacent dates across the same or different slots in one booking, and the same all-slots-must-qualify rule still applies.

### Configurable cancellation window — not hardcoded, not built as a feature yet

The `24 hours` window and `7 day` per-booked-slot threshold are read from a single named, platform-wide constant — **not per-venue, by deliberate decision** (see Section 16):

```typescript
// config/booking-policy.config.ts
export const BOOKING_POLICY = {
  cancellationWindowHours: 24,
  minDaysBeforeEventToCancel: 7,
};
```

This is **not** a database-driven or per-venue setting in Phase 1 — it's a single value a developer changes and redeploys when the business decides to adjust the policy, applying identically to every venue and every booking on the platform. If the policy later becomes graduated (e.g. shorter windows as the event approaches), `cancellationWindowHours` becomes a small calculation instead of a flat number — the rest of the system doesn't need to be redesigned.

### Disclosure at booking time

The exact policy outcome is computed and returned in the `POST /bookings` response (`cancellationEligible` + `cancellationPolicy` fields) and must be shown to the user on the same screen as the Razorpay checkout — **before** payment, not discovered only when they later try to cancel. The same deadline is also surfaced in the booking-confirmation notification itself once payment succeeds, not just in the API response.

### Why this stays simpler than full Phase 2 cancellation

| Concern in full cancellation (Phase 2) | Present in this grace-period version? |
|---|---|
| Refund tiers varying by days-before-event | ❌ No — always 100% or not allowed at all |
| Partial cancellation of individual booked slots within a multi-day booking | ❌ No — all-or-nothing at the booking level |
| Owner-side cancellation | ❌ No — user-initiated only |
| Partial refunds | ❌ No |
| Graduated cancellation windows (shorter window as event nears) | ❌ No — flat config constant in Phase 1, structurally ready for this later |
| Per-venue cancellation policy | ❌ No — explicitly rejected as a platform-wide standard, not just deferred (see Section 16) |
| Notifying the owner of disruption | ✅ Yes — the same `NotificationService.create()` pattern already used elsewhere |

---

## 9. Reliability & Integrity Safeguards

These safeguards close real gaps that exist in a naive version of the lock-first flow above, identified during a dedicated hardening review and folded directly into this LLD.

### 9.1 Idempotent Booking Creation

**The problem:** if a user double-clicks "Book," or their network retries a slow request, the frontend could send `POST /bookings` twice for the exact same set of slots. Without protection, this can create two parallel `PENDING_PAYMENT` bookings and attempt to acquire the same Redis locks twice from the same client.

**The fix:** every `POST /bookings` request must include an `Idempotency-Key` header (a UUID generated once per distinct user action, reused automatically by the frontend if it retries the same request). The backend checks Redis for that key before doing any work — if found, it returns the **exact same response** as the original request rather than processing again. The key is stored with the same 600s TTL as the slot locks themselves.

### 9.2 Razorpay Webhook Signature Verification

**The problem:** without verifying that a webhook request genuinely originated from Razorpay, anyone who discovers the webhook URL could POST a fake `payment.captured` payload and obtain a confirmed booking — now potentially a multi-day one — without ever paying.

**The fix:** before touching any `Booking`/`BookedSlot` row or Redis key, the webhook handler computes an HMAC-SHA256 signature of the raw request body using `RAZORPAY_WEBHOOK_SECRET`, and compares it to the `X-Razorpay-Signature` header. A mismatch is rejected with 400 immediately.

### 9.3 Price Snapshot Integrity

**The problem:** `slotPrice` (and therefore `totalPrice`) is calculated once, at booking creation, from the `VenueSlotPricing` row the user selected at that moment. If the owner edits their pricing tiers afterward — even while a different booking is still `PENDING_PAYMENT` — that must never retroactively change an already-created booking's price.

**The principle:** once `slotPrice` is written to a `BookedSlot` row, it is a **permanent snapshot**, the same way a paper receipt doesn't change if a shop's prices change tomorrow. It must never be recalculated from current `VenueSlotPricing` data at confirmation, at display time, or ever.

### 9.4 Orphaned Razorpay Orders

**The problem:** when a user abandons checkout and their booking becomes `EXPIRED`, the single Razorpay order created for that multi-slot attempt still technically exists on Razorpay's side, unpaid.

**The decision:** no active reconciliation job exists in Phase 1. An unpaid Razorpay order with no corresponding `CONFIRMED` booking is self-evidently abandoned and can simply be left alone at this scale.

---

## 10. NestJS Module Structure

```
booking/
├── booking.module.ts
├── booking.controller.ts
├── booking.service.ts
├── payment/
│   ├── razorpay.provider.ts
│   ├── payment.service.ts
│   └── webhook.controller.ts        // includes signature verification (9.2)
├── cancellation/
│   └── cancellation.service.ts      // grace-window eligibility check + refund trigger
├── locks/
│   └── slot-lock.service.ts         // wraps Redis lock acquire/release/verify, operates per-booked-slot
├── idempotency/
│   └── idempotency.service.ts       // wraps idempotency key check/store (9.1)
└── dto/
    ├── create-booking.dto.ts        // includes nested slots[] array
    ├── booked-slot.dto.ts
    ├── razorpay-webhook.dto.ts
    └── cancel-booking.dto.ts
```

---

## 11. Cross-Module Calls

| Direction | Call | Purpose |
|---|---|---|
| Booking → Venue | `checkSlotAvailability(venueId, slotPricingTierId, eventDate)` | Pre-lock overlap check, called once per booked slot |
| Booking → Venue | `computeOccupiedWindow(slotTemplateId, eventDate)` | Resolve concrete occupiedFrom/occupiedTo for each `BookedSlot` |
| Booking → Venue | *(direct read, not a service call)* `VenueSlotPricing` row by `slotPricingTierId` | Source of `slotPrice` — read directly, not derived from a guest-count lookup |
| Booking → Venue | *(implicit, on cancel)* | Releasing `occupiedFrom`/`occupiedTo` simply means the cancelled slots no longer count in future overlap checks — no explicit "release" call needed, since the overlap check already filters by `status` |
| Booking → Notification | `NotificationService.create(...)` | Direct service call on confirm/refund/cancel — no schema relation |

---

## 12. Validation Rules (DTOs)

| Field | Rule |
|---|---|
| `Idempotency-Key` (header) | Required on `POST /bookings`, valid UUID |
| `venueId` | Required, valid UUID, must belong to an `APPROVED` venue |
| `slots` | Required array, minimum 1 entry, maximum 30 entries (sanity cap to prevent abuse) |
| `slots[].slotPricingTierId` | Required, valid UUID, must belong to a `VenueSlotTemplate` owned by `venueId` |
| `slots[].eventDate` | Required, valid date, must not be in the past |
| `slots[]` uniqueness | No two slots may share the same `(slotPricingTierId's slotTemplateId, eventDate)` pair — duplicate selection of the same slot+date is rejected at validation, before any availability check |
| `X-Razorpay-Signature` (webhook header) | Required, must match computed HMAC of raw body |

---

## 13. Sequence Flows

### Grace-Period Cancellation (whole booking, all slots)

```
User → Frontend: "Cancel Booking" on a CONFIRMED booking
Frontend → Backend: POST /api/v1/bookings/:id/cancel

Backend → Backend: check booking.cancellationEligible === true
Backend → Backend: check now() - booking.confirmedAt <= BOOKING_POLICY.cancellationWindowHours
   IF either check fails:
      → 400 "This booking can no longer be cancelled"
   ELSE:
      → PostgreSQL: Booking.status = CANCELLED, cancelledAt = now()  (applies to all slots at once)
      → Razorpay: trigger full refund via refund API, for totalPrice
      → PostgreSQL: store razorpayRefundId
      → NotificationService.create(userId, BOOKING_UPDATE, "Booking cancelled, refund initiated")
      → NotificationService.create(ownerId, BOOKING_UPDATE, "A booking was cancelled")
      → Frontend: 200 { message, refundId }
```

### Multi-Slot Booking Creation (Happy Path)

```
User → Frontend: Selects 4 booked slots (same slot tier, 4 consecutive dates)
Frontend → Backend: POST /bookings { slots: [4 entries] }

Backend → Venue: checkSlotAvailability() × 4 — all pass
Backend → Redis: SET slot-lock × 4 — all succeed
Backend → Venue: computeOccupiedWindow() × 4
Backend → Read VenueSlotPricing.price × 4 → sum = totalPrice
Backend → PostgreSQL: insert 1 Booking + 4 BookedSlot rows
Backend → Razorpay: create 1 order for totalPrice
Backend → Frontend: 201 { bookingId, slots: [4], razorpayOrder }

User → Razorpay: pays once
Razorpay → Backend: webhook, signature valid
Backend → Redis: GET all 4 locks — all still valid
Backend → PostgreSQL: Booking.status = CONFIRMED
Backend → Redis: DEL all 4 locks
Backend → Notification: "Booking Confirmed"
```

### Multi-Slot Booking Creation (Partial Failure — Rollback)

```
User → Frontend: Selects 4 booked slots
Frontend → Backend: POST /bookings { slots: [4 entries] }

Backend → Venue: checkSlotAvailability() × 4 — all pass (race: someone books the 3rd slot right after this check)
Backend → Redis: SET slot-lock for slot 1 — succeeds
Backend → Redis: SET slot-lock for slot 2 — succeeds
Backend → Redis: SET slot-lock for slot 3 — FAILS (already locked by the concurrent booking)
Backend → Redis: DEL slot-lock for slot 1, DEL slot-lock for slot 2  (rollback what succeeded)
Backend → Frontend: 409 { unavailableSlots: [slot 3] }
// No Booking row was ever created — the user can retry with a different date for slot 3
```

---

## 14. Edge Cases Handled

| Case | Behaviour |
|---|---|
| User double-clicks "Book" or request is retried | `Idempotency-Key` ensures only one booking is created; duplicate requests get the same cached response |
| Two users attempt the same slot+date simultaneously | Redis `SET ... NX` ensures only the first acquires that booked slot's lock; second gets 409 immediately for that booked slot |
| One booked slot in a multi-slot request becomes unavailable mid-process | All locks acquired so far in that request are released; entire request fails with 409, listing which booked slot(s) failed |
| Lock expires before payment completes (any booked slot) | Webhook re-check fails for that booked slot → auto full refund of the entire booking via Razorpay, booking marked `REFUNDED` |
| User abandons checkout entirely | Booking and all its slots stay `PENDING_PAYMENT`; cleanup logic marks the booking `EXPIRED` once TTL has clearly passed |
| Razorpay webhook arrives twice (duplicate delivery) | Webhook handler is idempotent — checks `Booking.status` first; if already `CONFIRMED`, does nothing |
| Webhook request has an invalid/missing signature | 400, rejected before touching any Booking/BookedSlot row or lock |
| User selects the same slot+date twice in one request | 400 at validation, before any availability check |
| Venue owner edits pricing tiers after a booking already exists | No effect on existing bookings — `slotPrice`/`totalPrice` were already snapshotted (9.3) |
| One booked slot's date is within 7 days, others are not | Entire booking's `cancellationEligible = false` — no partial eligibility |
| User tries to cancel a booking confirmed 25 hours ago | 400 — outside the cancellation window, even if `cancellationEligible` was true |
| User tries `/cancel` on a `PENDING_PAYMENT` booking | 400 — wrong endpoint; must use `/cancel-pending` instead |
| User tries `/cancel-pending` on an already-`CONFIRMED` booking | 400 — too late, payment already went through |
| User submits more than 30 slots in one request | 400 — sanity cap rejected at validation |

---

## 15. Out of Scope (Phase 1)

- Full cancellation policy with variable refund tiers based on days-before-event
- Graduated cancellation windows that shrink as the event date approaches — the config constant is structured to allow this later without a redesign, but the logic itself is not built now
- **Partial/per-booked-slot cancellation** within a multi-day booking — cancellation is all-or-nothing at the booking level
- **Per-venue cancellation policy** — explicitly rejected, not just deferred. A platform-wide, consistent cancellation standard was judged better for user trust than letting policy vary venue-to-venue
- Owner-initiated cancellation
- Admin force-cancel on an owner's behalf
- Cancellation-count / reliability tracking per venue or user
- Partial refunds of any kind
- Retry/extend-lock-on-webhook-in-flight — if any booked slot's lock expires mid-payment, the system refunds the entire booking rather than attempting to extend it
- Active reconciliation of orphaned Razorpay orders
- Modifying an existing booking's slots after creation (adding/removing a date from an already-created booking) — to change a booking, the user would cancel (if eligible) and create a new one

---

## 16. Decision Log

| Date | Decision | Reasoning |
|---|---|---|
| 2026-06-21 | Lock-first, not pay-first | Pay-first allows two users to both complete payment for the same slot before either lock exists — defeats the purpose of locking entirely |
| 2026-06-21 | Lock TTL = 10 minutes | Generous enough for UPI app-switching delays common in India; tuned for this payment mix, not a fixed industry standard |
| 2026-06-21 | Webhook re-verifies locks before confirming, not just at lock-creation time | Payment gateways are slow/unpredictable; a lock could expire between checkout start and webhook arrival |
| 2026-06-21 | Lock-expiry-during-payment → automatic full refund | System-integrity fallback, not a customer-facing policy — should be instant and full, not partial or manual |
| 2026-06-21 | Booking row created at PENDING_PAYMENT before payment completes | Gives the webhook a concrete row to update; keeps abandoned checkouts visible in history rather than vanishing silently |
| 2026-06-21 | Added grace-period cancellation (eligibility decided at booking, window since confirmation) | Narrower and policy-free version of full cancellation — always 100% refund, no tiers — genuinely simple enough for Phase 1 |
| 2026-06-21 | Cancellation policy disclosed at booking time, not just enforced later | Protects against disputes; user makes an informed choice before paying |
| 2026-06-21 | REFUNDED and CANCELLED kept as separate statuses | One is a system fallback (lock expired), the other a deliberate user action |
| 2026-06-21 | `cancellationEligible` computed once at booking creation, stored as a field, never re-derived | The 7-day condition only ever moves one direction, so the computed answer remains correct for the booking's lifetime |
| 2026-06-21 | Cancellation window (24hrs) stored as a single named config constant, not hardcoded inline | Keeps today's implementation simple while making a future policy change cheap |
| 2026-06-21 | Cancellation policy is platform-wide, not per-venue — rejected a `VenueCancellationPolicy` schema entirely | Letting policy vary venue-to-venue would make the user experience unpredictable; a consistent standard was judged better for trust |
| 2026-06-21 | Added `Idempotency-Key` requirement on booking creation | Closes a real double-submission gap using infrastructure already in place |
| 2026-06-21 | Added Razorpay webhook signature verification as a precondition | Without it, the webhook endpoint would accept forged "payment succeeded" requests |
| 2026-06-21 | `totalPrice`/`slotPrice` documented explicitly as permanent snapshots, never recalculated | Prevents a future contributor from "optimizing" them into a live-joined value |
| 2026-06-21 | No active reconciliation job for orphaned Razorpay orders in Phase 1 | Harmless at MVP scale; recorded as a deliberate choice |
| 2026-06-21 | **Reversed: multi-day bookings are now self-service, not "contact owner manually"** | The earlier manual-contact approach undermined the actual purpose of the platform — a user shouldn't need to leave the app to book multiple days. Replaced with `BookedSlot`, all-or-nothing multi-slot locking, and a single payment covering all selected dates |
| 2026-06-21 | `Booking` restructured as a parent with `BookedSlot[]` children | A booking is no longer tied to exactly one date — needed to represent any number of slot+date selections under one payment and one confirmation |
| 2026-06-21 | Pricing is selected by the user as an exact `VenueSlotPricing` tier (`slotPricingTierId`), not looked up from a typed guest count | The owner already defines fixed guest-band tiers with fixed prices when setting up a venue's slots (Venue Module). The user picks the tier that matches their event size directly — there's no need for the backend to "calculate" which tier applies, and no `guestCount` field is needed anywhere in this schema |
| 2026-06-21 | `cancellationEligible` for a multi-slot booking requires EVERY booked slot to independently satisfy the 7-day threshold | Allowing cancellation based on just one qualifying booked slot would let a user cancel an entire booking including imminent dates bundled within it — undermines the policy's intent |
| 2026-06-21 | Booking slots cannot be added/removed after creation — changes require cancel + recreate | Keeps the payment/lock/confirmation model simple; modifying an in-flight or confirmed multi-slot booking would reintroduce much of the complexity multi-slot booking was designed to avoid |
| 2026-06-21 | Clarified the "owner" auth label on `cancel-pending`, `cancel`, and `GET /:id` to mean "the User who created this booking," not the Venue Owner | The word "owner" was ambiguous given `VENUE_OWNER` is also a real role in this system. Clarified that neither cancellation endpoint ever requires Venue Owner approval — both are fully automatic and user-initiated; the Venue Owner only receives a notification afterward |

---

## 17. Open Questions

- [ ] Should the cleanup job that marks abandoned `PENDING_PAYMENT` bookings as `EXPIRED` run on a schedule (cron), or lazily on next read? Low priority for Phase 1 demo, but worth deciding before real users hit it.
- [ ] Confirm Razorpay refund webhook handling — refunds aren't always instant; should `CANCELLED`/`REFUNDED` status be set optimistically on request, or only after Razorpay confirms the refund succeeded?
- [ ] Decide whether `cancel-pending` should also explicitly notify the Venue module/owner, or whether silence is fine since no commitment was ever made (payment never completed).
- [ ] A database-level exclusion constraint (PostgreSQL `EXCLUDE USING gist`) as a secondary safety net alongside the Redis lock was considered during the hardening review. Not included in Phase 1 since it requires a raw SQL migration outside standard Prisma syntax — worth revisiting if booking volume grows significantly.
- [ ] Confirm the maximum slots-per-booking cap (currently set at 30 as a sanity default) is appropriate, or should it be lower/higher based on realistic multi-day event lengths.
- [ ] Decide whether the frontend should warn the user *before* submission if their selected slots span an unusually long range (e.g. more than 14 days), purely as a UX safeguard against accidental selection — no backend validation change implied either way.

---

## 18. Corresponding Changes Applied to the Venue Module

> ✅ **Status: Applied 2026-06-21.** The items below were originally recorded as pending when this section was first written. They have since been applied to the Venue Module LLD (now v2.2) and are kept here only as a historical record of what changed and why.

- **Section 7a** ("Manual Date Blocking & Owner Contact Fallback") was rewritten — multi-day bookings are no longer the reason a user would need to contact the owner manually. `VenueBlockedDate` still exists for genuinely offline reasons (maintenance, arrangements made entirely outside the app), but it is no longer *the* answer for multi-day events specifically.
- **Section 16** (Out of Scope) no longer lists "Multi-day bookings... handled by the owner manually" — that line was removed as incorrect.
- **Section 11** (Cross-Module Calls) now notes that Booking reads `VenueSlotPricing` rows directly by ID, rather than calling a generic pricing-lookup service.
- **Section 1** (Scope) no longer bundles manual date blocking with multi-day bookings in one sentence.
- A matching Decision Log entry recording this reversal was added to the Venue LLD, so both documents tell the same consistent story.
- Two additional stale references were also caught and fixed in the Venue LLD during this pass: a leftover `pricePerDay` field in the search response contract, and a stale `PATCH /venues/:id/availability` endpoint from the earlier date-based availability model — neither was directly caused by this Booking update, but both were inconsistent with the current schema and are now corrected.