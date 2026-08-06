const Venues = require("../../models/venue");

async function venueOwnerCreateVenue(req, res) {
   try {
      const venue = await Venues.create({ venueOwner: req.user._id });
      return res.status(201).json({ data: venue });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to create venue" });
   }
}

module.exports = venueOwnerCreateVenue;
