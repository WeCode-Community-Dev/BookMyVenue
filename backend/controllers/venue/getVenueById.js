const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const { PUBLIC_VENUE_FILTER, PUBLIC_FIELDS, VENUE_POPULATE } = require("./shared");

// GET /venues/:id — public detail for a single APPROVED venue.
async function getVenueById(req, res) {
   try {
      const { id } = req.params;

      // Invalid ObjectId → treat as not found.
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return res.status(400).json({ error: "Invalid venue id", message: "Venue not found" });
      }

      const venue = await Venues.findOne({ _id: id, ...PUBLIC_VENUE_FILTER })
         .select(PUBLIC_FIELDS)
         .populate(VENUE_POPULATE)
         .lean();

      // 404 whether it doesn't exist or isn't public — avoids leaking
      // the existence of pending/rejected/deleted listings.
      if (!venue) {
         return res.status(404).json({ message: "Venue not found" });
      }

      return res.status(200).json({ data: venue });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to fetch venue" });
   }
}

module.exports = getVenueById;
