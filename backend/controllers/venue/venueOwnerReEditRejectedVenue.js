const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const { VENUE_STATUSES } = require("../../constants/venue");
const {
   VENUE_POPULATE,
   OWNER_HIDDEN_FIELDS,
   statusNotAllowedMessage,
} = require("./shared");

// POST /venueOwner/reEditRejectedVenue/:id
// Pulls a REJECTED venue back into editing. The doc is flipped in place back to a
// draft state — DRAFT for a rejected brand-new venue (editOf null), EDIT_DRAFT for
// a rejected edit copy of a live APPROVED venue (editOf set) — and returned so the
// owner can fix it and submit again through the normal flow. No new document is
// created (preserving the one-copy-per-original invariant), and the copy keeps the
// owner's last (rejected) edits plus the admin's rejectionReason so they can see
// what to fix.
//
// :id is the REJECTED doc's own id (the row the owner clicked in the Rejected tab).
async function venueOwnerReEditRejectedVenue(req, res) {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid venue id" });
      }

      const venue = await Venues.findOne({
         _id: id,
         venueOwner: req.user._id,
         deletedAt: null,
      });

      if (!venue) {
         return res.status(404).json({ message: "Venue not found" });
      }

      if (venue.status !== VENUE_STATUSES.REJECTED) {
         return res.status(400).json({ message: statusNotAllowedMessage("reEdit") });
      }

      // Rejected edit copy (editOf set) → EDIT_DRAFT; rejected new venue → DRAFT.
      venue.status = venue.editOf
         ? VENUE_STATUSES.EDIT_DRAFT
         : VENUE_STATUSES.DRAFT;
      await venue.save();

      const editable = await Venues.findById(venue._id)
         .select(OWNER_HIDDEN_FIELDS)
         .populate(VENUE_POPULATE)
         .lean();

      return res.status(200).json({ data: editable });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to re-open venue for editing" });
   }
}

module.exports = venueOwnerReEditRejectedVenue;
