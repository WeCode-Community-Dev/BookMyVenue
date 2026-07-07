# Product Requirements Document (PRD)

## Venue404 – External Reservation Conversion & Venue Onboarding Workflow

# Overview

This feature enables Venue404 administrators to convert **external venue reservation requests** into fully onboarded Venue404 venues and normal platform bookings.

Instead of losing customers because a venue is not registered on Venue404, administrators act as a temporary intermediary between the customer and the external venue owner. Once the owner agrees to join the platform, the reservation gradually transitions into the standard Venue404 booking flow.

This feature is designed to generate supply (venue owners) from customer demand while keeping all bookings inside the existing Venue404 architecture.

---

# Objectives

## Business

- Capture customers even when venues are not registered.
- Convert high-demand external venues into Venue404 partners.
- Grow marketplace inventory organically.
- Eliminate manual spreadsheets or email tracking.

## Technical

- Reuse existing Owner, Venue, and Booking modules.
- Avoid duplicate booking logic.
- Maintain complete audit history.
- Keep workflow status-driven.

---

# User Roles

## Customer

Creates an External Reservation.

## Administrator

- Manages external reservations.
- Contacts venue owners.
- Invites owners.
- Approves venues.
- Creates the final booking.

## Venue Owner

- Accepts invitation.
- Sets a password.
- Completes venue profile.
- Submits venue for approval.

---

# High-Level Workflow

```text
Customer
    │
    ▼
External Reservation
    │
    ▼
Admin Dashboard
    │
    ▼
Admin Contacts Venue
    │
    ▼
Owner Interested
    │
    ▼
Invite Owner
    │
    ▼
Owner Account Created
    │
    ▼
Draft Venue Created
    │
    ▼
Owner Completes Venue
    │
    ▼
Venue Approval
    │
    ▼
Venue Approved
    │
    ▼
Create Booking
    │
    ▼
Normal Venue404 Booking Flow
```

---

# External Reservation Lifecycle

| Status | Description |
|---------|-------------|
| NEW | Reservation submitted |
| CONTACTED | Admin contacted venue |
| OWNER_INTERESTED | Venue agreed to join |
| OWNER_INVITED | Invitation email sent |
| OWNER_ONBOARDED | Owner activated account |
| VENUE_DRAFT_CREATED | Draft venue exists |
| VENUE_PENDING_APPROVAL | Owner submitted venue |
| VENUE_APPROVED | Venue approved |
| BOOKING_CREATED | Booking generated |
| CLOSED | Reservation completed |
| CANCELLED | Customer cancelled |
| REJECTED | Venue unavailable |

---

# Admin Dashboard

Each reservation is displayed as a vertical card.

```text
External Reservation

Customer: John Doe
Venue: Grand Palace Kochi
Guests: 450
Date: 12 December

Stage: CONTACTED

Owner: Not Invited
Venue: Draft Not Created
Booking: Not Created

Actions:
- Contact Owner
- Invite Owner
- Open Venue
- Create Booking
```

Buttons become available only when the current status allows them.

---

# Contact Owner

Store:

- Contact method
- Notes
- Follow-up date

Updates status to **CONTACTED**.

---

# Invite Owner

Collect:

- Venue name
- Owner name (optional)
- Email
- Phone (optional)

System actions:

- Create owner account (invited state)
- Generate secure password setup link
- Send invitation email
- Create draft venue
- Link owner to reservation

---

# Draft Venue

Automatically created.

Fields:

- owner_id
- venue_name
- status = Draft
- source = External Reservation

The owner completes the remaining details later.

---

# Venue Approval

Uses the existing Venue Approval workflow.

Owner submits → Admin approves → Reservation status becomes **VENUE_APPROVED**.

---

# Create Booking

Available only when:

- Owner is onboarded
- Venue is approved
- No booking already exists

Booking is created using the existing booking service.

Reservation stores the generated `booking_id`.

---

# Database Changes

Add to `external_reservations`:

```text
owner_id UUID NULL
venue_id UUID NULL
booking_id UUID NULL
status
contact_notes
follow_up_date
contact_method
owner_invited_at
booking_created_at
```

---

# Status Transitions

| Current | Next |
|----------|------|
| NEW | CONTACTED |
| CONTACTED | OWNER_INTERESTED |
| OWNER_INTERESTED | OWNER_INVITED |
| OWNER_INVITED | OWNER_ONBOARDED |
| OWNER_ONBOARDED | VENUE_DRAFT_CREATED |
| VENUE_DRAFT_CREATED | VENUE_PENDING_APPROVAL |
| VENUE_PENDING_APPROVAL | VENUE_APPROVED |
| VENUE_APPROVED | BOOKING_CREATED |
| BOOKING_CREATED | CLOSED |

---

# Audit Log

Track:

- Reservation Created
- Owner Contacted
- Invitation Sent
- Owner Activated
- Draft Venue Created
- Venue Submitted
- Venue Approved
- Booking Created
- Reservation Closed

---

# Success Metrics

## Business

- External reservations converted into owners
- Owners completing onboarding
- Draft venues submitted
- Approved venues
- Reservations converted into bookings

## Technical

- No duplicate owners
- No orphan draft venues
- Existing booking service reused
- Complete audit trail

---

# Future Enhancements

- Owner self-claiming
- Duplicate venue detection
- CRM follow-ups
- Reminder emails
- Calendar sync
- Digital contracts
- Direct customer-owner messaging

---

# Design Principles

1. One booking system.
2. Status-driven workflow.
3. Progressive supplier onboarding.
4. Complete auditability.
