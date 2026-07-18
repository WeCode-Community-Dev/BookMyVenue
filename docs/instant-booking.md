# Instant Booking

**Status:** Shipped — verified against code, 2026-07-17. Supersedes `instant_booking.md` (a 981-line implementation-directive doc written before the feature was built; trimmed here to an as-built reference — `booking_mode`, `payment_pending`, and the `FULL` payment type are all confirmed live in `venue/models.py`, `booking/models.py`, and `payment/service.py`).

A second booking mode alongside the existing owner-approval ("Manual") flow: pay-and-confirm immediately, no owner acceptance step. The Manual flow is unchanged — Instant Booking is additive, not a replacement.

## Design principle

Inventory is reserved **before** payment begins, so multiple customers can't race to pay for the same slot simultaneously. No new "Reservation" concept was introduced — a `Booking` row *is* the reservation, reusing the existing Booking, Availability, and Payment modules rather than building a parallel system.

## Booking modes

Every venue has one `booking_mode`: `MANUAL` (default) or `INSTANT`, set on `Venue.booking_mode`.

| | Manual | Instant |
|---|---|---|
| Flow | request → owner approval → payment → confirmed | reserve inventory → payment → confirmed |
| Entry status | `requested` | `payment_pending` |
| Owner action required | Yes (accept/reject) | No |

## Instant booking flow

```
Acquire venue lock (single DB transaction)
        │
        ▼
Validate availability
        │
        ▼
Create Booking (status = payment_pending)
        │
        ▼
Create BookingSlot, is_blocking = true   ← inventory locked immediately, before payment
        │
        ▼
Create Stripe PaymentIntent
        │
        ▼
Return checkout details + payment_expires_at
```

Because `is_blocking` is set to `true` immediately (not on confirmation, as in the Manual flow), the same `booking_slots_no_overlap` GIST exclusion constraint that protects Manual bookings also protects Instant ones — no availability-logic changes were needed. See [`booking-lifecycle.md`](./booking-lifecycle.md).

## Payment types

The existing payment flow (`ADVANCE` then `BALANCE`) is extended, not replaced, with a third type:

| Type | Meaning |
|---|---|
| `advance` | Initial token payment (Manual flow) |
| `balance` | Remaining amount before the event (both flows) |
| `full` | Pay the entire quoted price upfront — available at checkout on **both** Manual and Instant bookings, customer's choice |

## State machine

```
payment_pending ──payment succeeds──▶ confirmed
        │
        ├──▶ hold_expired      (payment_expires_at elapses)
        ├──▶ user_cancelled
        ├──▶ admin_cancelled
        └──▶ conflict_cancelled
```

`payment_pending` reuses the existing `hold_expired` status for timeouts rather than introducing a new one — a background job finds `payment_pending` bookings past `payment_expires_at`, transitions them to `hold_expired`, and releases the slot (`BookingSlot.is_blocking = false`). Full transition table: [`booking-lifecycle.md`](./booking-lifecycle.md).

## API surface

`POST /bookings` behavior branches on the target venue's `booking_mode` — same endpoint, different response shape:

- **Manual venue** → `status: requested`, `payment_required: false`.
- **Instant venue** → `status: payment_pending`, `payment_required: true`, plus `payment_options` (advance/full amounts), `client_secret`, `payment_expires_at`.

No new endpoints were added for the core flow — only response payloads changed.

## Frontend behavior

- Venue detail page shows an "⚡ Instant Booking" badge and "Instant Confirmation — No Owner Approval Required"; the CTA reads "Book Instantly" instead of "Request Booking".
- Checkout presents the advance/full payment choice and, for Instant bookings, a countdown timer against `payment_expires_at`.
- Booking details page shows "Awaiting Payment" while `status = payment_pending`.
- Search supports an `instant_booking` filter and badge (see [`search.md`](./search.md)).

## Edge cases handled

Payment abandoned or retried, duplicate/delayed Stripe webhooks, payment succeeding just after the reservation timeout, owner disabling Instant Booking or editing availability mid-payment, price changes during checkout (`409 PRICE_CHANGED`, see [`dynamic-pricing.md`](./dynamic-pricing.md)), venue unpublished/suspended mid-flow, and simultaneous booking attempts on the same slot — the last of these is where the GIST exclusion constraint does the real work, not application-level checking.
