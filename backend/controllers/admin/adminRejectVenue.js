const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const {
   VENUE_STATUSES,
   REVIEW_STATUSES,
   HISTORY_ACTIONS,
   REJECTION_REASON_MIN_LENGTH,
} = require("../../constants/venue");

// POST /admin/venues/:id/reject
// Rejects a venue awaiting review. Requires a rejectionReason (min length
// enforced). Rejection never changes a venue's version.
//   PENDING (new venue)        → REJECTED in place; reason + REJECTION history on
//                                itself. Owner can later fix & resubmit.
//   CHANGES_PENDING (edit copy) → the copy becomes REJECTED (carrying the reason
//                                so the owner sees it), the original stays
//                                APPROVED untouched, and the REJECTION history
//                                entry is recorded on the ORIGINAL. Runs in a
//                                transaction so both writes apply together.
async function adminRejectVenue(req, res) {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid venue id" });
      }

      const rejectionReason = (req.body.rejectionReason || "").trim();
      if (rejectionReason.length < REJECTION_REASON_MIN_LENGTH) {
         return res.status(400).json({
            message: `Rejection reason must be at least ${REJECTION_REASON_MIN_LENGTH} characters`,
         });
      }

      // Status filter doubles as a concurrency guard (see adminApproveVenue).
      const venueDocForReview = await Venues.findOne({
         _id: id,
         status: { $in: REVIEW_STATUSES },
         deletedAt: null,
      });

      if (!venueDocForReview) {
         return res.status(404).json({ message: "Venue not found or already reviewed" });
      }

      const rejectionEntry = (version) => ({
         action: HISTORY_ACTIONS.REJECTION,
         by: req.user._id,
         at: new Date(),
         version,
         rejectionReason,
      });

      // New venue: reject in place; history lives on itself.
      if (venueDocForReview.status === VENUE_STATUSES.PENDING) {
         venueDocForReview.status = VENUE_STATUSES.REJECTED;
         venueDocForReview.rejectionReason = rejectionReason;
         venueDocForReview.editHistory.push(rejectionEntry(venueDocForReview.version));
         await venueDocForReview.save();

         return res.status(200).json({
            message: "Venue rejected",
            data: { status: venueDocForReview.status },
         });
      }

      // Edit copy (CHANGES_PENDING): reject the copy, record history on the original.
      const original = await Venues.findOne({
         _id: venueDocForReview.editOf,
         status: VENUE_STATUSES.APPROVED,
         deletedAt: null,
      });

      venueDocForReview.status = VENUE_STATUSES.REJECTED;
      venueDocForReview.rejectionReason = rejectionReason;
      original.editHistory.push(rejectionEntry(original.version));

      const session = await mongoose.startSession();
      try {
         await session.withTransaction(async () => {
            await venueDocForReview.save({ session });
            await original.save({ session });
         });
      } finally {
         await session.endSession();
      }

      return res.status(200).json({
         message: "Venue rejected",
         data: { status: venueDocForReview.status },
      });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to reject venue" });
   }
}

module.exports = adminRejectVenue;
