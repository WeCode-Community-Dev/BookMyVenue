const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const SlotTemplates = require("../../models/slotTemplate");
const { materializeVenueAvailability } = require("../../services/materializeVenueAvailability");

const MINUTES_IN_DAY = 1440;

// POST /venueOwner/venues/:id/slots   body: { label, startTime, endTime, price }
// startTime/endTime are minutes since midnight (e.g. 540 = 09:00).
async function venueOwnerCreateSlot(req, res) {
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

      const { label, startTime, endTime, price } = req.body;

      if (!label || !String(label).trim()) {
         return res.status(400).json({ message: "label is required" });
      }

      if (
         !Number.isInteger(startTime) ||
         startTime < 0 ||
         startTime >= MINUTES_IN_DAY
      ) {
         return res.status(400).json({ message: "startTime must be an integer between 0 and 1439" });
      }

      if (
         !Number.isInteger(endTime) ||
         endTime < 0 ||
         endTime >= MINUTES_IN_DAY
      ) {
         return res.status(400).json({ message: "endTime must be an integer between 0 and 1439" });
      }

      if (endTime <= startTime) {
         return res.status(400).json({ message: "endTime must be after startTime" });
      }

      if (typeof price !== "number" || price <= 0) {
         return res.status(400).json({ message: "price must be a positive number" });
      }

      const trimmedLabel = String(label).trim();

      const existingSlots = await SlotTemplates.find({ venue: id, deletedAt: null }).lean();

      const labelTaken = existingSlots.some(
         (s) => s.label.trim().toLowerCase() === trimmedLabel.toLowerCase()
      );
      if (labelTaken) {
         return res.status(409).json({ message: "A slot with this label already exists for this venue" });
      }

      const overlappingSlots = existingSlots.filter(
         (s) => s.isActive && startTime < s.endTime && s.startTime < endTime
      );
      if (overlappingSlots.length > 0) {
         return res.status(409).json({
            message: "This slot overlaps with existing active slot(s)",
            data: { overlappingSlots },
         });
      }

      const session = await mongoose.startSession();
      let slot;
      try {
         await session.withTransaction(async () => {
            const created = await SlotTemplates.create(
               [{ venue: id, label: trimmedLabel, startTime, endTime, price }],
               { session }
            );
            slot = created[0];
            await materializeVenueAvailability(id, session);
         });
      } finally {
         await session.endSession();
      }

      return res.status(201).json({ data: slot });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to create slot" });
   }
}

module.exports = venueOwnerCreateSlot;
