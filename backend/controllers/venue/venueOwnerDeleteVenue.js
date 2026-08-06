const Venues = require("../../models/venue");
const { DELETABLE_STATUSES } = require("../../constants/venue");
const { statusNotAllowedMessage } = require("./shared");

// DELETE /venueOwner/venues/delete/:id
// Hard-deletes a DRAFT document OR an EDIT_DRAFT clone document.
// This is a permanent delete (not soft-delete) because:
//   - DRAFT  : venue was never submitted, safe to drop entirely
//   - EDIT_DRAFT: it is a clone of an APPROVED venue; deleting it discards the
//     in-progress edits without affecting the original APPROVED document
async function venueOwnerDeleteVenue(req, res) {
   try {
      const venue = await Venues.findOne({
         _id: req.params.id,
         venueOwner: req.user._id,
         deletedAt: null,
      });
      if (!venue) return res.status(404).json({ message: "Venue not found" });

      if (!DELETABLE_STATUSES.includes(venue.status)) {
         return res.status(400).json({
            message: statusNotAllowedMessage("delete"),
         });
      }

      await Venues.deleteOne({ _id: venue._id });
      return res.status(200).json({ message: "Venue deleted" });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to delete venue" });
   }
}

module.exports = venueOwnerDeleteVenue;
