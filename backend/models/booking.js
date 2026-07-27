const mongoose = require("mongoose");

const BOOKING_STATUSES = ["PENDING_PAYMENT", "CONFIRMED", "EXPIRED", "FAILED"];

// A copy of the customer-facing venue fields as they were at booking time —
// so later venue edits (name, address, images...) never change what an
// existing booking's record shows. Not a ref; a real snapshot.
const venueSnapshotSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      addressLine: { type: String },
      city: { type: String },
      district: { type: String },
      state: { type: String },
      pincode: { type: String },
      images: { type: [{ url: String }], default: [] },
      categoryName: { type: String },
      amenityNames: { type: [String], default: [] },
   },
   { _id: false }
);

const bookingSchema = new mongoose.Schema(
   {
      // Human-readable id shown to the customer/owner (e.g. on a receipt) —
      // distinct from the Mongo _id. Format: "BMVKL" + 15 random uppercase
      // alphanumeric characters, 20 characters total.
      bookingId: { type: String, required: true, unique: true },

      venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true, index: true },
      venueSnapshot: { type: venueSnapshotSchema, required: true },

      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
      venueOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

      // BookableUnits never change once BOOKED, so these are plain refs —
      // no snapshot needed (unlike the venue, which stays editable).
      units: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "BookableUnit" }], required: true },

      // The guest-count bucket the customer picked (e.g. "200 - 400") —
      // informational for the venue owner, not validated against capacity.
      expectedGuests: { type: String, required: true },

      subtotal: { type: Number, required: true, min: 0 },
      gst: { type: Number, required: true, min: 0 },
      total: { type: Number, required: true, min: 0 },

      status: { type: String, enum: BOOKING_STATUSES, default: "PENDING_PAYMENT" },
      holdExpiresAt: { type: Date, required: true },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema, "bookings");
