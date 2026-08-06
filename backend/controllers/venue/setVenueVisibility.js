const Venues = require("../../models/venue");
const { VENUE_STATUSES } = require("../../constants/venue");

// PATCH /venueOwner/venues/visibility/:id
// Toggles the isActive flag on an APPROVED venue (venue owner-controlled show/hide).
//
// Rules:
//   - Venue must belong to req.user._id (venue owner check)
//   - Current status must be APPROVED — only live venues can be toggled
//   - req.body.isActive must be a boolean
//
// TODO:
//   1. Validate req.body.isActive is strictly a boolean; if not return 400
//      { message: "isActive must be a boolean" }
//   2. Find venue by req.params.id where venueOwner === req.user._id and deletedAt === null
//   3. If not found return 404 { message: "Venue not found" }
//   4. If venue.status !== VENUE_STATUSES.APPROVED return 400
//      { message: "Only APPROVED venues can be enabled or disabled" }
//   5. Set venue.isActive = req.body.isActive and call venue.save()
//   6. Return 200 { message: isActive ? "Venue enabled" : "Venue disabled",
//                   data: { isActive: venue.isActive } }
//   7. On error return 500 { message: "Failed to update venue visibility" }
async function setVenueVisibility(req, res) {
   // TODO: implement
   return res.status(501).json({ message: "Not implemented" });
}

module.exports = setVenueVisibility;
