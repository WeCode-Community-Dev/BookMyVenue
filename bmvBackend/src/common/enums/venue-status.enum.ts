/**
 * Lifecycle status of a venue.
 *
 * State machine:
 *   DRAFT → PENDING_REVIEW → APPROVED
 *                          → CHANGES_REQUESTED → (owner edits) → PENDING_REVIEW
 *                          → REJECTED (terminal — contact support)
 *   APPROVED → SUSPENDED (admin action)
 */
export enum VenueStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED',
  RESUBMITTED = 'RESUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

