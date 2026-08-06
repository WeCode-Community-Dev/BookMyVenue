const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const { VENUE_STATUSES, REVIEW_STATUSES, HISTORY_ACTIONS } = require("../../constants/venue");
const { EDITABLE_VENUE_FIELDS } = require("../venue/shared");

// POST /admin/venues/:id/approve
// Approves a venue awaiting review:
//   PENDING (new venue)        → APPROVED in place; version 0→1.
//   CHANGES_PENDING (edit copy) → merge the copy's editable fields into its
//                                 original APPROVED venue (version++), then
//                                 hard-delete the copy. Runs in a transaction so
//                                 the merge and delete can't half-apply.
// Every approval bumps the surviving/original doc's version and appends an
// APPROVAL entry to its editHistory, and clears any stale rejectionReason.
async function adminApproveVenue(req, res) {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid venue id" });
      }

      // Status filter doubles as a concurrency guard: if another admin already
      // actioned this venue, it's no longer in a review status → 404, no
      // double-processing.
      const venueDocForReview = await Venues.findOne({
         _id: id,
         status: { $in: REVIEW_STATUSES },
         deletedAt: null,
      });

      if (!venueDocForReview) {
         return res.status(404).json({ message: "Venue not found or already reviewed" });
      }

      const approvalEntry = (version) => ({
         action: HISTORY_ACTIONS.APPROVAL,
         by: req.user._id,
         at: new Date(),
         version,
      });

      // New venue: approve in place.
      if (venueDocForReview.status === VENUE_STATUSES.PENDING) {
         venueDocForReview.status = VENUE_STATUSES.APPROVED;
         venueDocForReview.version += 1;
         venueDocForReview.rejectionReason = "";
         venueDocForReview.editHistory.push(approvalEntry(venueDocForReview.version));
         await venueDocForReview.save();

         return res.status(200).json({
            message: "Venue approved",
            data: { status: venueDocForReview.status, version: venueDocForReview.version },
         });
      }

      // Edit copy (CHANGES_PENDING): merge into the original, then delete the copy.
      const original = await Venues.findOne({
         _id: venueDocForReview.editOf,
         status: VENUE_STATUSES.APPROVED,
         deletedAt: null,
      });


      for (const field of EDITABLE_VENUE_FIELDS) {
         original[field] = venueDocForReview[field];
      }
      original.version += 1;
      original.rejectionReason = "";
      original.editHistory.push(approvalEntry(original.version));
      
      const session = await mongoose.startSession();
      try {
         await session.withTransaction(async () => {
            await original.save({ session });
            await venueDocForReview.deleteOne({ session });
         });
      } finally {
         await session.endSession();
      }

      return res.status(200).json({
         message: "Venue changes approved",
         data: { status: original.status, version: original.version },
      });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to approve venue" });
   }
}

module.exports = adminApproveVenue;
