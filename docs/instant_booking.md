# Venue404 - Reservation Based Instant Booking

## Objective

Implement **Reservation Based Instant Booking** while maintaining full backward compatibility with the existing booking flow.

The existing Manual Booking flow must continue to function exactly as today.

Instant Booking should be introduced as an additional booking mode.

---

# Goals

- Keep existing Manual Booking flow unchanged.
- Introduce Reservation Based Instant Booking.
- Reuse existing Booking, Availability and Payment modules.
- Reuse existing Stripe webhook.
- Keep existing payment architecture.
- Maintain backward compatibility.
- Allow customers to choose between paying the Advance amount or the Full amount.

---

# Reservation Based Instant Booking

Instead of allowing multiple customers to reach payment simultaneously, inventory is reserved before payment begins.

```
User
    │
Validate Availability
    │
Acquire Database Lock
    │
Reserve Slot
    │
Create Booking
(status = payment_pending)
    │
Create Payment Intent
    │
Stripe Checkout
    │
Stripe Webhook
    │
Confirmed
```

A reservation is represented by an existing Booking.

No Reservation table should be introduced.

---

# Booking Modes

Every venue supports one booking mode.

```
MANUAL

INSTANT
```

## Manual

```
User

↓

Booking Request

↓

Owner Approval

↓

Payment

↓

Confirmed
```

---

## Instant

```
User

↓

Reserve Inventory

↓

Payment

↓

Confirmed
```

---

# Payment Options

The venue continues to define the advance percentage.

Example

```
advance_pct = 30%
```

During checkout the customer may choose either

```
Pay Advance

OR

Pay Full Amount
```

Example

```
Venue Price

₹100,000

↓

Customer chooses

○ Pay Advance ₹30,000

○ Pay Full ₹100,000
```

This applies to both Manual Booking and Instant Booking.

---

# Payment Types

Current payment flow supports

```
ADVANCE

BALANCE
```

Extend it to support

```
FULL
```

Final payment types become

```
ADVANCE

BALANCE

FULL
```

---

# Database Changes

## Venue

### Model

File

```
app/modules/venue/models.py
```

Add

```
booking_mode

MANUAL

INSTANT
```

Default

```
MANUAL
```

---

### Schemas

File

```
app/modules/venue/schemas.py
```

Expose

```
booking_mode
```

No other Venue module changes are required.

Venue services, APIs and owner portal changes will be implemented separately.

---

## Booking

File

```
app/modules/booking/models.py
```

Add Booking Status

```
payment_pending
```

Keep

```
hold_expired
```

unchanged.

---

Add fields

```
payment_expires_at

auto_confirmed_at

confirmed_by
```

Possible values

```
OWNER

SYSTEM

ADMIN
```

---

# Booking State Machine

## Manual Booking

Existing flow remains unchanged.

```
requested
    │
owner_accepted
    │
confirmed
    │
completed
```

---

## Instant Booking

```
payment_pending
        │
        ▼
confirmed
```

or

```
payment_pending
        │
        ▼
hold_expired
```

---

## New Valid Transitions

```
payment_pending
    -> confirmed

payment_pending
    -> hold_expired

payment_pending
    -> user_cancelled

payment_pending
    -> admin_cancelled

payment_pending
    -> conflict_cancelled
```

Existing transitions remain unchanged.

Update

```
booking/state_machine.py
```

Update

```
BookingStatusHistory
CHECK constraint
```

---

# Booking Flow

## Manual

```
Create Booking

↓

requested
```

No changes.

---

## Instant

```
Acquire Lock

↓

Validate Availability

↓

Create Booking

status = payment_pending

↓

Create Booking Slot

↓

BookingSlot.is_blocking = true

↓

Create Payment Intent

↓

Return Checkout Details
```

Additionally

```
payment_expires_at

= now() + configured timeout
```

---

# Availability

Current availability logic already relies on

```
BookingSlot.is_blocking
```

No availability query changes are required.

Manual

```
requested

↓

not blocking

↓

owner_accepted

↓

blocking
```

Instant

```
payment_pending

↓

blocking immediately
```

Availability APIs remain unchanged.

---

# Payment Flow

Current architecture

```
Advance Payment

↓

Balance Payment
```

must remain unchanged.

Only extend it.

---

## Customer Payment Options

At checkout

```
○ Pay Advance

○ Pay Full Amount
```

---

## Advance Payment

```
Advance Paid

↓

Booking Confirmed

↓

Balance Payment Later
```

Booking

```
payment_status

advance_paid
```

---

## Full Payment

```
Full Paid

↓

Booking Confirmed
```

Booking

```
payment_status

fully_paid
```

Balance Due

```
0
```

No Balance Payment will be created.

---

## Payment Service

Extend Payment Service to support creating Payment Intents for

```
ADVANCE

BALANCE

FULL
```

Instead of

```
create_advance_payment_intent()
```

support

```
create_payment_intent(

payment_type,

amount
)
```

Payment amount depends on customer selection.

---

# Stripe Webhook

Existing webhook architecture remains unchanged.

Only extend payment confirmation logic.

---

## ADVANCE Payment

```
payment_pending

↓

confirmed

↓

payment_status = advance_paid
```

Balance payment remains pending.

---

## FULL Payment

```
payment_pending

↓

confirmed

↓

payment_status = fully_paid

↓

balance_due = 0
```

No Balance Payment is required.

---

## BALANCE Payment

Existing flow remains unchanged.

```
advance_paid

↓

fully_paid
```

---

Additional fields

```
auto_confirmed_at

confirmed_by = SYSTEM
```

Existing webhook idempotency remains unchanged.

---

# Reservation Timeout

Create background worker.

Runs periodically.

Find

```
status = payment_pending

AND

payment_expires_at < now()
```

Transition

```
hold_expired
```

Release

```
BookingSlot.is_blocking = false
```

Reuse

```
hold_expired
```

No new expiration status should be introduced.

---

# APIs Requiring Changes

## POST

```
/bookings
```

Manual Venue

```
requested

payment_required = false
```

Instant Venue

```
payment_pending

payment_required = true

payment_options

client_secret

payment_expires_at
```

Example response

```
payment_options

Advance ₹30,000

Full ₹100,000
```

No endpoint changes.

Only response changes.

---

## Venue APIs

Only expose

```
booking_mode
```

No additional implementation required.

---

# User Web Changes

## Venue Details

Display

```
⚡ Instant Booking
```

Display

```
Instant Confirmation

No Owner Approval Required
```

---

Button

Manual

```
Request Booking
```

Instant

```
Book Instantly
```

---

## Checkout

Display payment options

```
Choose Payment

○ Pay Advance

○ Pay Full Amount
```

---

Manual

```
Booking Requested
```

Instant

```
Complete Payment

14:59 Remaining
```

Display countdown using

```
payment_expires_at
```

---

## Booking Details

Display

```
Awaiting Payment
```

when booking status is

```
payment_pending
```

---

## Search

Display badge

```
⚡ Instant Booking
```

Optional filter

```
Instant Booking Only
```

---

# Availability Locking

Reservation should occur inside a single database transaction.

```
Acquire Venue Lock

↓

Validate Availability

↓

Create Booking

↓

Create Booking Slot

↓

Mark Slot Blocking

↓

Commit
```

Inventory must be reserved before payment begins.

---

# Edge Cases

Implement handling for

- Payment abandoned
- Payment retry
- Duplicate webhook
- Delayed webhook
- Payment succeeds after reservation timeout
- Owner disables Instant Booking
- Owner edits availability during payment
- Owner blocks dates during payment
- Price changes during checkout
- Capacity changes
- Venue unpublished
- Venue suspended
- Simultaneous bookings
- Full-day bookings
- Time-slot bookings
- Multi-day bookings
- Payment failure
- Browser refresh
- Double-click booking
- Mobile reconnect

---

# Files To Update

## Venue

```
app/modules/venue/models.py

app/modules/venue/schemas.py
```

Only these files should be updated in the Venue module.

---

## Booking

```
app/modules/booking/models.py

app/modules/booking/service.py

app/modules/booking/state_machine.py

app/modules/booking/helpers.py

app/modules/booking/schemas.py
```

---

## Payment

```
app/modules/payment/service.py

app/modules/payment/webhook.py
```

Payment Service changes

- Support ADVANCE, BALANCE and FULL payment intents.
- Allow customer-selected payment amount.
- Skip balance payment when FULL payment succeeds.

Webhook changes

- Handle ADVANCE payments.
- Handle FULL payments.
- Handle BALANCE payments.
- Update booking payment status appropriately.
- Auto-confirm Instant Bookings after successful ADVANCE or FULL payment.
- Preserve existing webhook idempotency behavior.

---

## Availability

```
app/modules/availability/service.py
```

Minimal logic updates.

---

## Background Jobs

Create

```
app/jobs/payment_pending_expiry.py
```

---

# Backward Compatibility

- Existing Manual Booking flow must remain unchanged.
- Existing APIs must continue to work.
- Existing clients must continue to work.
- Existing payment architecture remains unchanged.
- Keep `hold_expired`.
- Do not rename existing statuses.
- Existing Advance and Balance payment flows continue to work.
- FULL payment is introduced as an additional payment option.
- Instant Booking is introduced as an additional booking mode.
- No existing functionality should regress.