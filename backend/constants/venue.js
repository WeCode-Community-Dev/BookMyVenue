// Venue domain constants — shared across model, controllers, and seed.
// Centralized here so there are no magic strings scattered through the codebase.

// Listing lifecycle. Only APPROVED venues are publicly searchable
const VENUE_STATUSES = {
   DRAFT: "DRAFT",           // Venue owner just created the venue; fields can be filled anytime. Not visible to admin or public.
   PENDING: "PENDING",       // Venue owner submitted the venue; waiting for admin approval. Not yet public.
   APPROVED: "APPROVED",     // Admin approved the venue; visible to the public (if isActive is true).
   REJECTED: "REJECTED", // REJECTED means admin declined (+rejectionReason); not terminal — venue owner can fix & resubmit (REJECTED → change back to "DRAFT"/"EDIT_DRAFT" → submit → PENDING)
   EDIT_DRAFT: "EDIT_DRAFT", // EDIT_DRAFT is an in-progress edit copy of a live (APPROVED) venue (editOf field set in db); venue owner keeps editing until they submit it (EDIT_DRAFT → submit → CHANGES_PENDING).
   CHANGES_PENDING: "CHANGES_PENDING", // CHANGES_PENDING is a submitted edit copy waiting for admin re-approval; on approve it merges into the original.
};

// Venue owner-initiated submit → review queue.
//   DRAFT  → PENDING          (a new/own venue enters the queue)
//   EDIT_DRAFT        → CHANGES_PENDING  (a drafted edit copy enters the queue)
const SUBMITTABLE_STATUSES = Object.freeze([
   VENUE_STATUSES.DRAFT,
   VENUE_STATUSES.EDIT_DRAFT,
]);

// Venue owner-initiated hard delete. Only never-submitted/in-progress copies are
// deletable:
//   DRAFT       → a new venue that was never submitted; safe to drop entirely
//   EDIT_DRAFT  → an edit copy of a live APPROVED venue; deleting it discards the
//                 in-progress edits without touching the original APPROVED doc
const DELETABLE_STATUSES = Object.freeze([
   VENUE_STATUSES.DRAFT,
   VENUE_STATUSES.EDIT_DRAFT,
]);

// Statuses an edit applies in place (the doc isn't live). Covers a new venue's
// own draft states AND a not-yet-submitted edit copy. APPROVED is absent — editing
// an APPROVED venue spawns a new EDIT_DRAFT copy instead. AND PENDING, CHANGES_PENDING are submitted versions
const IN_PLACE_EDIT_STATUSES = Object.freeze([
   VENUE_STATUSES.DRAFT,
   VENUE_STATUSES.EDIT_DRAFT,
]);

// Statuses awaiting an admin decision — the admin review queue.
//   PENDING          → a brand-new venue submitted for first approval
//   CHANGES_PENDING  → a submitted edit copy awaiting re-approval
const REVIEW_STATUSES = Object.freeze([
   VENUE_STATUSES.PENDING,
   VENUE_STATUSES.CHANGES_PENDING,
]);

// Admin decisions recorded in a venue's editHistory. Deliberately distinct from
// the APPROVED/REJECTED status strings so a history entry (the noun for the
// decision) isn't confused with the venue's lifecycle state.
const HISTORY_ACTIONS = Object.freeze({
   APPROVAL: "APPROVAL",
   REJECTION: "REJECTION",
});

module.exports = {
   VENUE_STATUSES,
   VENUE_STATUS_VALUES: Object.values(VENUE_STATUSES),
   SUBMITTABLE_STATUSES,
   DELETABLE_STATUSES,
   IN_PLACE_EDIT_STATUSES,
   REVIEW_STATUSES,
   HISTORY_ACTIONS,
   HISTORY_ACTION_VALUES: Object.values(HISTORY_ACTIONS),
};
