const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const SlotTemplates = require("../../models/slotTemplate");

// GET /venueOwner/venues/:id/slots
// Returns all non-deleted slots for a venue owned by the authenticated venue owner.
async function venueOwnerListSlots(req, res) {
   try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ message: "Invalid venue id" });
      }

      const venue = await Venues.findOne({
         _id: id,
         venueOwner: req.user._id,
         deletedAt: null,
      }).lean();
      if (!venue) {
         return res.status(404).json({ message: "Venue not found" });
      }

      const slots = await SlotTemplates
         .find({ venue: id, deletedAt: null })
         .sort({ startTime: 1 })
         .lean();

      return res.status(200).json({ data: slots });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to fetch slots" });
   }
}

module.exports = venueOwnerListSlots;
