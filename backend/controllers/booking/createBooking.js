const mongoose = require("mongoose");
const Venues = require("../../models/venue");
const BookableUnits = require("../../models/bookableUnit");
const Bookings = require("../../models/booking");
const { PUBLIC_VENUE_FILTER } = require("../venue/shared");
const generateBookingId = require("../../utils/generateBookingId");

const HOLD_TTL_MINUTES = 10;
const GST_RATE = 0.18; // TODO: make configurable via admin dashboard

function buildVenueSnapshot(venue) {
   return {
      name: venue.name,
      addressLine: venue.addressLine,
      city: venue.city,
      district: venue.district,
      state: venue.state,
      pincode: venue.pincode,
      images: venue.images?.map((img) => ({ url: img.url })) || [],
      categoryName: venue.venueCategory?.name,
      amenityNames: venue.amenities?.map((a) => a.name) || [],
   };
}

// POST /bookings   body: { venueId, unitIds, expectedGuests }
// Atomically claims every requested BookableUnit (AVAILABLE, or HELD past its
// own heldUntil) and creates a PENDING_PAYMENT Booking. All-or-nothing: if any
// requested unit can't be claimed, the whole request fails and nothing changes.
async function createBooking(req, res) {
   try {
      const { venueId, unitIds, expectedGuests } = req.body;

      if (!mongoose.Types.ObjectId.isValid(venueId)) {
         return res.status(400).json({ message: "Invalid venue id" });
      }
      if (!Array.isArray(unitIds) || unitIds.length === 0) {
         return res.status(400).json({ message: "unitIds must be a non-empty array" });
      }
      if (!unitIds.every((id) => mongoose.Types.ObjectId.isValid(id))) {
         return res.status(400).json({ message: "unitIds contains an invalid id" });
      }
      const uniqueUnitIds = [...new Set(unitIds.map(String))];
      if (!expectedGuests || !String(expectedGuests).trim()) {
         return res.status(400).json({ message: "expectedGuests is required" });
      }

      const venue = await Venues.findOne({ _id: venueId, ...PUBLIC_VENUE_FILTER })
         .populate({ path: "venueCategory", select: "name" })
         .populate({ path: "amenities", select: "name" })
         .lean();
      if (!venue) {
         return res.status(404).json({ message: "Venue not found" });
      }

      const now = new Date();

      // Fast-fail before opening a transaction: reject an unknown id, a unit
      // belonging to a different venue, or a past slot — without any
      // transactional overhead. Also captures each unit's current slot
      // template label/price — read here — this is what gets frozen onto
      // the unit as slotTemplateDetailsWhileBooking.
      const unitsWithTemplateDetails = await BookableUnits.find({
         _id: { $in: uniqueUnitIds },
         venue: venueId,
      })
         .populate({ path: "slotTemplate", select: "label price" })
         .lean();
      if (unitsWithTemplateDetails.length !== uniqueUnitIds.length) {
         return res.status(400).json({ message: "One or more passed unitIds do not exist for this venue" });
      }
      if (unitsWithTemplateDetails.some((u) => u.startAt < now)) {
         return res.status(400).json({ message: "One or more selected slots are in the past" });
      }

      const heldUntil = new Date(now.getTime() + HOLD_TTL_MINUTES * 60 * 1000);

      const session = await mongoose.startSession();
      let booking;
      try {
         await session.withTransaction(async () => {
            // Per-unit conditional update (not updateMany) because each unit
            // needs its OWN slotTemplateDetailsWhileBooking written — a plain
            // updateMany can only set the same value on every matched document.
            const claimOps = unitsWithTemplateDetails.map((unit) => ({
               updateOne: {
                  filter: {
                     _id: unit._id,
                     venue: venueId,
                     $or: [
                        { status: "AVAILABLE" },
                        { status: "HELD", heldUntil: { $lt: now } },
                     ],
                  },
                  update: {
                     status: "HELD",
                     heldUntil,
                     // Always overwritten on every successful claim, even if a
                     // stale value already exists from a previous, since-expired
                     // hold on this same unit.
                     slotTemplateDetailsWhileBooking: {
                        label: unit.slotTemplate.label,
                        price: unit.slotTemplate.price,
                     },
                  },
               },
            }));

            const claimResult = await BookableUnits.bulkWrite(claimOps, { session, ordered: true });

            if (claimResult.modifiedCount !== uniqueUnitIds.length) {
               const err = new Error("One or more selected slots are no longer available");
               err.status = 409;
               throw err;
            }

            const subtotal = unitsWithTemplateDetails.reduce((sum, u) => sum + u.slotTemplate.price, 0);
            const gst = Math.round(subtotal * GST_RATE);
            const total = subtotal + gst;

            const created = await Bookings.create(
               [{
                  bookingId: generateBookingId(),
                  venue: venueId,
                  venueSnapshot: buildVenueSnapshot(venue),
                  user: req.user._id,
                  venueOwner: venue.venueOwner,
                  units: uniqueUnitIds,
                  expectedGuests: String(expectedGuests).trim(),
                  subtotal,
                  gst,
                  total,
                  status: "PENDING_PAYMENT",
                  holdExpiresAt: heldUntil,
               }],
               { session }
            );
            booking = created[0];
         });
      } finally {
         await session.endSession();
      }

      return res.status(201).json({ data: booking });
   } catch (err) {
      if (err.status === 409) {
         return res.status(409).json({ message: err.message });
      }
      return res.status(500).json({ message: "Sorry, something went wrong" });
   }
}

module.exports = createBooking;
