const Venues = require("../../models/venue");
const { VENUE_STATUSES, SUBMITTABLE_STATUSES } = require("../../constants/venue");
const { missingRequiredVenueFields, statusNotAllowedMessage } = require("./shared");

// DRAFT enters the new-venue queue; EDIT_DRAFT enters the re-approval queue.
const NEXT_STATUS_ON_SUBMIT = {
   [VENUE_STATUSES.DRAFT]: VENUE_STATUSES.PENDING,
   [VENUE_STATUSES.EDIT_DRAFT]: VENUE_STATUSES.CHANGES_PENDING,
};

// POST /venueOwner/venues/submit/:id
// Moves a venue from DRAFT → PENDING or EDIT_DRAFT → CHANGES_PENDING,
// putting it in the admin review queue. Drafts persist incomplete, so this is
// the completeness gate: all REQUIRED_VENUE_FIELDS must be filled before submit.
async function venueOwnerSubmitVenue(req, res) {
   try {
      const venue = await Venues.findOne({
         _id: req.params.id,
         venueOwner: req.user._id,
         deletedAt: null,
      });
      if (!venue) return res.status(404).json({ message: "Venue not found" });

      if (!SUBMITTABLE_STATUSES.includes(venue.status)) {
         return res.status(400).json({
            message: statusNotAllowedMessage("submit"),
         });
      }

      const missingFields = missingRequiredVenueFields(venue);
      if (missingFields.length) {
         return res.status(400).json({
            message: "Required fields are missing",
            missingFields,
         });
      }

      venue.status = NEXT_STATUS_ON_SUBMIT[venue.status];
      await venue.save();

      return res.status(200).json({
         message: "Venue submitted for review",
         data: { status: venue.status },
      });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to submit venue" });
   }
}

module.exports = venueOwnerSubmitVenue;
