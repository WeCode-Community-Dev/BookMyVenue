const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const { REVIEW_STATUSES } = require("../../constants/venue");
const { CATEGORY_POPULATE } = require("../venue/shared");

// Owner fields surfaced to the review page — enough to identify/contact the owner.
const OWNER_POPULATE = { path: "venueOwner", select: "name email" };

// Fields excluded from the review detail. version/editHistory are the admin audit
// trail (not shown on the review page yet); deletedAt/__v are internal.
const DETAIL_HIDDEN_FIELDS = "-version -editHistory -deletedAt -__v";

// GET /admin/venues/:id
// Returns a single venue awaiting review (PENDING or CHANGES_PENDING) for the
// admin review page. Non-review statuses are treated as not found — this endpoint
// only serves the approval queue. For a CHANGES_PENDING edit copy the response
// carries `editOf` (the original APPROVED venue's id) so the UI can link to the
// live listing.
async function adminGetVenueById(req, res) {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid venue id" });
      }

      const venue = await Venues.findOne({
         _id: id,
         status: { $in: REVIEW_STATUSES },
         deletedAt: null,
      })
         .select(DETAIL_HIDDEN_FIELDS)
         .populate(CATEGORY_POPULATE)
         .populate(OWNER_POPULATE)
         .lean();

      if (!venue) {
         return res.status(404).json({ message: "Venue not found" });
      }

      return res.status(200).json({ data: venue });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to fetch venue" });
   }
}

module.exports = adminGetVenueById;
