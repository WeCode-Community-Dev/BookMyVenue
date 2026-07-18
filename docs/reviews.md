# Venue Reviews

**Status:** Shipped — verified against code, 2026-07-17. Previously documented as an implementation plan; the `review` module (`models.py`, `routes.py`, `service.py`, `schemas.py`) is fully built and this is the as-built reference.

A customer review system for venues — helps future customers make informed decisions and gives owners feedback, with admin moderation to handle abuse without gating legitimate reviews.

## Business rules

- Only authenticated customers may create reviews.
- A review can only be created for a **completed booking** (`booking.status == completed`).
- One review per completed booking (`UNIQUE(booking_id)` on `venue_reviews`).
- Reviews are public immediately on submission — no pre-moderation queue.
- Customers may edit or delete only their own review.
- Venue owners can view reviews for their own venues but cannot edit, delete, or moderate them.
- Admins have full moderation control.
- Rating and comment are both required; deletion is soft (`deleted_at`).

## Data model

`venue_reviews`: `id`, `venue_id`, `booking_id` (unique), `user_id`, `rating`, `title` (optional), `comment`, `is_hidden`, `hidden_reason`, `hidden_by`, `hidden_at`, timestamps, `deleted_at`.

## Moderation

Reviews are visible the moment they're created. Admins can, after the fact:

- Hide a review (with a reason)
- Restore a hidden review
- Delete a review
- View all reviews including hidden/deleted, filterable by status

This lets abusive or spam reviews get moderated without delaying legitimate feedback from ever appearing.

## API surface

| Method | Path | Who |
|---|---|---|
| `POST` | `/venues/{venue_id}/reviews` | Customer, own completed booking |
| `GET` | `/venues/{venue_id}/reviews` | Public |
| `GET` | `/venues/{venue_id}/reviews/summary` | Public — aggregate rating |
| `GET` / `PATCH` / `DELETE` | `/reviews/{review_id}` | Review author |
| `GET` | `/owner/reviews` | Venue owner — read-only, own venues |
| `GET` | `/admin/reviews`, `/admin/reviews/{id}` | Admin |
| `PATCH` | `/admin/reviews/{id}/hide`, `/admin/reviews/{id}/restore` | Admin |
| `DELETE` | `/admin/reviews/{id}` | Admin |
