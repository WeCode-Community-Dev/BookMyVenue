# Venue Reviews – Implementation Plan

## Goal

Implement a customer review system for venues.

Reviews are intended to help future customers make informed booking decisions while giving venue owners valuable feedback.

Implementation must follow the existing modular architecture.

**Backend must be completed, reviewed, and tested before any frontend work begins.**

---

# Business Rules

* Only authenticated customers may create reviews.
* A review can only be created for a **completed booking**.
* One review is allowed per completed booking.
* Reviews are public by default immediately after submission.
* Administrators have full moderation control.
* Venue owners can view reviews for their own venues but cannot edit, delete, or moderate them.
* Customers may edit or delete only their own review.
* Deleted reviews are soft deleted.
* Rating is required.
* Comment is required.
* Reviews contribute to the venue's public rating summary.

---

# Review Moderation

Reviews are publicly visible immediately after creation.

Administrators may later:

* Hide a review
* Restore a hidden review
* Delete a review
* View all reviews (including hidden/deleted)
* Filter reviews by status

This allows abusive or spam reviews to be moderated without delaying legitimate customer feedback.

---

# Backend First

Complete every backend task before starting frontend.

---

# Phase 1 — Database

## Model

Create `VenueReview`

Suggested fields

* id
* venue_id
* booking_id
* user_id
* rating
* title (optional)
* comment
* is_hidden
* hidden_reason (optional)
* hidden_by
* hidden_at
* created_at
* updated_at
* deleted_at

---

## Migration

Create migration for

* venue_reviews table
* indexes
* foreign keys
* uniqueness constraint

Recommended constraint

```
UNIQUE (booking_id)
```

to ensure one review per completed booking.

---

# Phase 2 — Schemas

Create

* ReviewCreate
* ReviewUpdate
* ReviewResponse
* ReviewListResponse
* ReviewSummaryResponse
* AdminReviewActionRequest

---

# Phase 3 — Repository

Create repository methods

Customer

* create_review()
* update_review()
* delete_review()
* get_review()
* list_venue_reviews()

Admin

* list_all_reviews()
* hide_review()
* restore_review()
* delete_review()

Statistics

* get_rating_summary()

---

# Phase 4 — Service

Implement business rules.

## Create Review

Validate

* booking exists
* booking belongs to current user
* booking status is completed
* booking has no existing review

Persist review.

---

## Update Review

Validate ownership.

Allow

* rating
* title
* comment

Do not allow changing

* venue
* booking
* author

---

## Delete Review

Soft delete.

---

## Rating Summary

Return

* average rating
* total reviews
* rating distribution (1–5)

---

# Phase 5 — API

Customer APIs

```
POST   /api/venues/{venue_id}/reviews

GET    /api/venues/{venue_id}/reviews

PATCH  /api/reviews/{review_id}

DELETE /api/reviews/{review_id}
```

Venue Detail

Extend venue response with

```
average_rating

review_count
```

---

# Phase 6 — Admin APIs

```
GET    /api/admin/reviews

GET    /api/admin/reviews/{review_id}

PATCH  /api/admin/reviews/{review_id}/hide

PATCH  /api/admin/reviews/{review_id}/restore

DELETE /api/admin/reviews/{review_id}
```

Supported filters

* venue
* user
* rating
* hidden
* deleted
* date range

---

# Phase 7 — Backend Tests

Repository

* create review
* update review
* soft delete
* summary

Service

* completed booking required
* duplicate prevention
* ownership validation
* statistics

API

* authorization
* validation
* moderation
* listing
* pagination

---

# Backend Review

Before frontend begins verify

* API contract
* database indexes
* permissions
* business rules
* tests
* documentation

Only after backend review is complete should frontend implementation begin.

---

# Frontend

---

# Phase 8 — API Client

Create API client methods

* getVenueReviews
* createReview
* updateReview
* deleteReview
* getReviewSummary

---

# Phase 9 — Public Venue Page

Add Reviews section

Display

* average rating
* review count
* rating distribution
* review list
* pagination
* empty state

---

# Phase 10 — Review Form

Visible only when

* user is authenticated
* user has an eligible completed booking
* booking has not already been reviewed

Support

* star rating
* optional title
* comment

---

# Phase 11 — Customer Review Management

Allow users to

* edit their review
* delete their review

---

# Phase 12 — Owner View

Owners can

* view reviews
* view rating summary
* filter reviews

Owners cannot

* edit
* delete
* hide
* restore

---

# Phase 13 — Admin Review Management

Admin page

Features

* list reviews
* search
* filter
* hide
* restore
* delete
* review details
* moderation history (if audit logging already exists)

---

# Phase 14 — Frontend Tests

Cover

* review list
* summary
* review form
* validation
* optimistic updates
* moderation UI
* permission handling

---

# Definition of Done

Backend

* Database completed
* Migration completed
* Schemas completed
* Repository completed
* Service completed
* APIs completed
* Tests passing
* Documentation updated
* Backend reviewed

Frontend

* Public reviews completed
* Review submission completed
* Customer management completed
* Owner view completed
* Admin moderation completed
* Tests passing
* Frontend reviewed

Only after both backend and frontend reviews are complete should the feature be considered finished.

