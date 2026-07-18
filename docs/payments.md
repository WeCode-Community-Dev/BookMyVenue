# Payments, Notifications & Background Jobs

**Status:** Shipped — verified against code, 2026-07-17. Supersedes and merges the earlier `payments-platform-architecture.md` (as-built) and `PRD-payments-notifications-platform.md` (pre-build draft) — both were snapshots from an early build stage and had since drifted from the shipped system.

Covers the `payment` and `notification` modules, the scheduled background jobs that drive booking-timeout logic, and the shared frontend packages built on top of them.

---

## 1. System at a glance

```
Clients (user-web, owner-portal, admin-panel)
        │ Bearer JWT
        ▼
FastAPI routers → services → Postgres (Supabase)
        │                        │
        ├──▶ Stripe (charges, refunds, webhooks)
        └──▶ Resend / SMTP (transactional email)

GitHub Actions cron ──▶ POST /internal/run-jobs ──▶ services
```

All money is stored as integer **paise** (`BigInteger`), never floats. All user references are `UUID` FKs to `profiles.id` (which equals `auth.users.id`). Append-only tables (`ledger_entries`, `admin_actions`, `booking_status_history`) are never `UPDATE`d or `DELETE`d.

---

## 2. Data model

| Table | Purpose |
|---|---|
| `payments` | Read-model of a single Stripe charge attempt for a booking (`payment_type`: `advance` \| `balance` \| `full`) |
| `refunds` | Refund records, linked to the originating payment |
| `ledger_entries` | **Append-only source of truth for every money movement** — `charge` / `refund` / `payout` / `platform_fee` / `platform_fee_reversal`, each with a `credit`/`debit` direction. `payments`/`refunds` are convenience read-models over these events. |
| `payout_requests` | Owner withdrawal requests |
| `stripe_events` | Webhook idempotency guard — PK is the Stripe event id, so a replayed webhook raises `IntegrityError` and the handler no-ops |

`payment_type` covers three cases: `advance` (the initial token payment that confirms a Manual booking), `balance` (the remaining amount before the event), and `full` (Instant Booking's pay-everything-now option — see [`instant-booking.md`](./instant-booking.md)).

---

## 3. Payments (Stripe)

Files: `payment/service.py`, `payment/webhooks.py`, `payment/routes.py`, `payment/models.py`.

### Create-intent (request path)

`create_payment_intent()` locks the booking `FOR UPDATE`, asserts caller ownership and a live payment window, computes the amount **server-side** from the booking's snapshotted `advance_due_paise`/`balance_due_paise`/`quoted_price_paise` (never client-supplied), creates a Stripe PaymentIntent with a booking-scoped idempotency key, records a `payments(pending)` row, and returns the `client_secret`.

### Confirmation (webhook path)

```
Customer confirms card payment on Stripe.js
        │
        ▼
Stripe webhook: payment_intent.succeeded
        │
        ▼
INSERT stripe_events (PK = event.id)  ──▶ duplicate? no-op, return early
        │
        ▼
BEGIN transaction, SELECT booking FOR UPDATE
        │
        ▼
confirm_payment() — advance/full → booking.status = confirmed
confirm_balance_payment() — balance → booking.payment_status = fully_paid
        │
        ▼
ledger_entries(charge) written; booking_slots.is_blocking = true
        │
        ▼
_find_competing_bookings() → losers flip to conflict_cancelled
  (any with a succeeded payment are auto-refunded via _conflict_cancel)
        │
        ▼
COMMIT — the GIST exclusion constraint on booking_slots blocks a double-win
        │
        ▼
notify() — in-app + email, all parties
```

### Race safety (the core invariant)

- **Idempotent webhooks**: each Stripe event is `INSERT`ed into `stripe_events` (PK = event id) before any side effect; a duplicate delivery raises `IntegrityError` and the handler returns early.
- **One transaction, row-locked**: confirmation runs inside `SELECT ... FOR UPDATE` on the booking.
- **Structural double-confirm prevention**: setting `booking_slots.is_blocking = true` is gated by the `booking_slots_no_overlap` GIST exclusion constraint (see [`booking-lifecycle.md`](./booking-lifecycle.md)). A losing concurrent confirmation hits `IntegrityError`, rolls back, then self-conflict-cancels and refunds via `_conflict_cancel_self_and_refund()` — only one `confirmed` booking per slot is possible, by construction, not by application discipline alone.
- **Competing requests** (`_find_competing_bookings`) are flipped to `conflict_cancelled`; any with a succeeded payment are auto-refunded (`_conflict_cancel`).

### Refunds

`refund_booking()` (owner/admin path) issues a Stripe refund, records a `refunds` row plus a ledger debit, updates the booking's refund/payment-status fields, and releases the slot. `_record_refund()` is the shared primitive used by cancellation, conflict, and stray-payment paths — refund amounts for user-initiated cancellations come from the tiered `venue_cancellation_policies` logic in `booking/cancellation.py` (see [`booking-lifecycle.md`](./booking-lifecycle.md#cancellation)), not a flat percentage.

---

## 4. Notifications (Resend/SMTP + in-app)

Files: `notification/service.py`, `notification/templates.py`, `notification/routes.py`.

- `notify(db, user_id, type, context, booking_id)` always writes an in-app `notifications` row first, then **best-effort** sends the email (Resend → SMTP → dev no-op). Email failure is logged and leaves `sent_at` NULL — it never aborts the surrounding DB transaction.
- Recipient email is resolved via the Supabase Admin API, since email lives in `auth.users`, not `profiles` (jobs and webhooks run without a request-scoped JWT).
- Endpoints: `GET /api/notifications/` (list), `PATCH /api/notifications/{id}/read` (ownership-checked).
- Event catalog includes: request received, new request (owner), request accepted, payment reminder, payment confirmed, hold expired, conflict cancelled, booking cancelled, refund issued, booking completed.

---

## 5. Background jobs

Business-timeout logic that used to run via in-process APScheduler now runs via **GitHub Actions cron** calling the token-guarded `POST /internal/run-jobs` endpoint (`ENABLE_JOBS=false` in `render.yaml` keeps the in-process scheduler off in production — it only runs locally). See [`DEPLOY.md`](./DEPLOY.md) for the exact cron schedule.

| Job | Effect |
|---|---|
| `hold_expiry` | `owner_accepted` bookings past their payment hold → `hold_expired` |
| `payment_reminders` | Reminders for bookings approaching their balance-payment deadline |
| `request_expiry` | Stale `requested` bookings with no owner movement → `request_expired` |
| `overdue_flag` / `overdue_autocancel` | Flags, then cancels, bookings whose balance is overdue → `balance_overdue_cancelled` |
| `completion` | `confirmed` bookings past their event date, fully settled → `completed` |

Every job runs inside its own transaction, transitions state through the booking lifecycle (never bypassing it), and calls `notify()` for the affected parties.

---

## 6. Shared packages

- **`packages/api-client`** — `createClient()` (typed fetch with Bearer auth, `401 → signOut`); endpoint modules for `auth`, `venues`, `bookings`, `payments`, `notifications`. Types are generated from the live OpenAPI schema (`pnpm --filter @venue404/api-client generate`).
- **`packages/ui`** — payment/notification primitives (`PaymentStatusBadge`, `ConfirmPaymentDialog`, `RefundDialog`, `NotificationList`/`NotificationItem`) and a `formatPaise` helper, built on the shared `Modal`/`Button`/`StatusBadge` components.

---

## 7. Invariant traceability

| Invariant (from `CLAUDE.md`) | Enforced by |
|---|---|
| Only one confirmed booking per slot | GIST exclusion constraint on `booking_slots` + `SELECT FOR UPDATE` |
| Acceptance does not reserve a slot | `booking_slots.is_blocking` only flips true on payment confirmation |
| Confirmation requires token payment | Webhook `payment_intent.succeeded` → `confirm_payment()` |
| Competing requests → conflict_cancelled | `_find_competing_bookings()` + `_conflict_cancel()` |
| User cancellation may reactivate competitors | `conflict_cancelled → requested` transition, triggered on `user_cancel_booking()` |
| Owner cancellation always refunds | `refund_booking()` / `admin_force_cancel()` |
| Losing payment attempts auto-refunded | `_conflict_cancel()` / `_conflict_cancel_self_and_refund()` |
| Webhooks idempotent | `stripe_events` PK = Stripe event id |
| Append-only ledger/audit | `ledger_entries`, `booking_status_history`, `admin_actions` — no `UPDATE`/`DELETE` in code |
| Frontend never trusted for authorization | Backend `AuthContext` + ownership checks on every mutating route |
| Service-role/Stripe secret keys never reach the browser | Backend-only settings; frontends use only publishable/anon keys |
