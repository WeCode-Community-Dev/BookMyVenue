# Booking Lifecycle

**Status:** Shipped — verified against code, 2026-07-17

The single source of truth for booking states. Derived directly from `BookingStatus` and the `ck_booking_status_history_transition` CHECK constraint in [`apps/api/app/modules/booking/models.py`](../apps/api/app/modules/booking/models.py) — not re-described from memory, so if this ever drifts from the enum, the enum wins.

Every transition is recorded as an append-only row in `booking_status_history` (old status, new status, who changed it, why, metadata) — the audit trail for disputes and support.

## States

```python
class BookingStatus(enum.StrEnum):
    requested = "requested"
    owner_accepted = "owner_accepted"
    confirmed = "confirmed"
    completed = "completed"
    hold_expired = "hold_expired"
    request_expired = "request_expired"
    conflict_cancelled = "conflict_cancelled"
    user_cancelled = "user_cancelled"
    admin_cancelled = "admin_cancelled"
    owner_rejected = "owner_rejected"
    balance_overdue_cancelled = "balance_overdue_cancelled"
    payment_pending = "payment_pending"
```

`payment_pending` is the Instant Booking entry state (see [`instant-booking.md`](./instant-booking.md)) — Manual bookings never enter it.

## Valid transitions

| From | To |
|---|---|
| `requested` | `owner_accepted`, `owner_rejected`, `user_cancelled`, `conflict_cancelled`, `request_expired` |
| `owner_accepted` | `confirmed`, `hold_expired`, `user_cancelled` |
| `hold_expired` | `owner_accepted` (owner selects a different requester) |
| `payment_pending` | `confirmed`, `hold_expired`, `user_cancelled`, `admin_cancelled`, `conflict_cancelled` |
| `confirmed` | `completed`, `user_cancelled`, `admin_cancelled`, `balance_overdue_cancelled` |

Any transition outside this table is rejected at the database layer by the CHECK constraint on `booking_status_history` — application code cannot silently write an invalid transition even if a bug tries to.

## Manual booking flow

```
requested ──owner accepts──▶ owner_accepted ──payment succeeds──▶ confirmed ──event passes──▶ completed
    │                              │
    ├─▶ owner_rejected             ├─▶ hold_expired  (owner may re-accept another requester)
    ├─▶ user_cancelled             └─▶ user_cancelled
    ├─▶ conflict_cancelled
    └─▶ request_expired
```

1. **Request** — a customer requests a slot. Requesting never reserves it; multiple customers can request the same slot concurrently.
2. **Accept** — the owner accepts one request → `owner_accepted`, starting a payment hold (`hold_expires_at` / `owner_action_deadline`, venue-configurable via `owner_action_window_hours`, 24–72h). Acceptance still does not block the slot — the underlying `BookingSlot.is_blocking` flag stays `false` until payment succeeds.
3. **Pay** — the accepted customer pays the advance (or full amount — see below) within the hold window.
   - Success → `confirmed`. `BookingSlot.is_blocking` becomes `true`; every other `requested` booking for the same slot → `conflict_cancelled`.
   - Timeout → `hold_expired`. The owner can accept a different requester, re-entering the hold.
4. **Complete** — `confirmed` → `completed` once the event date has passed with no pending payments, disputes, or active cancellation workflow.

## Instant booking flow

```
payment_pending ──payment succeeds──▶ confirmed ──event passes──▶ completed
        │
        ├─▶ hold_expired          (payment window elapses)
        ├─▶ user_cancelled
        ├─▶ admin_cancelled
        └─▶ conflict_cancelled
```

For venues with `booking_mode = INSTANT`: inventory is reserved (`BookingSlot.is_blocking = true`) *before* payment, inside one DB transaction — there is no owner-approval step. See [`instant-booking.md`](./instant-booking.md) for the full flow.

## Cancellation

Refunds are **not** a flat forfeit/refund rule — they're computed by `booking/cancellation.py` against the venue's `venue_cancellation_policies` row: three configurable tiers (`tier_1_hours`/`tier_2_hours`/`tier_3_hours` before the event, each with its own `refund_pct`), a `no_show_refund_pct`, and a `platform_fee_refundable` flag that decides whether the platform fee is excluded from the refundable base. A venue with no policy configured falls back to admin-defined platform defaults (`default_no_policy_refund_pct` / `default_no_policy_platform_fee_refundable` in `platform_settings`).

- **User cancels a confirmed booking** → `user_cancelled`. Refund amount is computed from the tiered policy above (closer to the event date = lower tier = smaller refund, by convention). Eligible `conflict_cancelled` requests for that slot return to `requested` so the owner can pick a replacement.
- **Owner force-cancels** (`admin_force_cancel` / `owner_cancel_forfeit`) → `admin_cancelled`, refunds independent of the tiered policy — the owner (not the customer) broke the commitment.
- **Owner goodwill cancellation** (`owner_cancel_goodwill`) → partial refund computed from the venue's `overdue_advance_refund_pct`, used for the balance-overdue path below.
- **Balance overdue** → `balance_overdue_cancelled` when the remaining balance isn't paid by `balance_due_date`; refund percentage governed by `overdue_advance_refund_pct`.

See [`payments.md`](./payments.md) for how refunds move through Stripe once the amount is computed.

## Payment integration

- `payment_status` (`unpaid` → `advance_paid` / `fully_paid` → `refunded` / `partially_refunded`) tracks money independently of `status`, since a booking can be `confirmed` with only the advance paid and a balance still due.
- `quoted_price_paise`, `advance_due_paise`, and `balance_due_paise` are snapshotted at booking creation (`ck_bookings_price_split` enforces `advance_due_paise + balance_due_paise = quoted_price_paise`) — later pricing-rule edits never retroactively change an existing booking. See [`dynamic-pricing.md`](./dynamic-pricing.md).
- Payment confirmation is transactional with row locking — two successful confirmations for the same slot are structurally impossible, and a losing concurrent payment attempt is automatically refunded. See [`payments.md`](./payments.md).

## Non-negotiable invariants

- Only one `confirmed` booking may exist per slot (enforced by `BookingSlot.is_blocking` + a Postgres exclusion constraint on overlapping blocking slots — see [`search.md`](./search.md) for how availability is queried on top of this).
- Acceptance never reserves a slot — only a successful payment does.
- A cancelled `confirmed` booking may reactivate competing requests; an owner/admin cancellation always refunds.
