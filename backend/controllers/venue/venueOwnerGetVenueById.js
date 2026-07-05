const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const { VENUE_POPULATE, OWNER_HIDDEN_FIELDS } = require("./shared");

// GET /venueOwner/venues/:id
// Returns a single venue owned by the authenticated venue owner, in ANY status
// (DRAFT/PENDING/APPROVED/REJECTED/EDIT_DRAFT/CHANGES_PENDING), excluding soft-deleted.
async function venueOwnerGetVenueById(req, res) {
   try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid venue id" });
      }

      const venue = await Venues.findOne({
         _id: id,
         venueOwner: req.user._id,
         deletedAt: null,
      })
         .select(OWNER_HIDDEN_FIELDS)
         .populate(VENUE_POPULATE)
         .lean();

      if (!venue) {
         return res.status(404).json({ message: "Venue not found" });
      }

      return res.status(200).json({ data: venue });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to fetch venue" });
   }
}

module.exports = venueOwnerGetVenueById;
