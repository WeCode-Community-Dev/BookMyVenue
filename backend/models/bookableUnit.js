const mongoose = require("mongoose");

const BOOKABLE_UNIT_STATUSES = ["AVAILABLE", "BOOKED"];

const bookableUnitSchema = new mongoose.Schema(
   {
      venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
      slotTemplate: { type: mongoose.Schema.Types.ObjectId, ref: "SlotTemplate", required: true },

      // "YYYY-MM-DD" — the specific calendar date this unit is materialized for.
      unitDate: { type: String, required: true },

      // The slot template's clock times resolved onto unitDate, as real instants.
      startAt: { type: Date, required: true },
      endAt: { type: Date, required: true },

      status: { type: String, enum: BOOKABLE_UNIT_STATUSES, default: "AVAILABLE" },
   },
   { timestamps: true }
);

// One unit per slot per date — the materialization job relies on this to be
// safely re-run without creating duplicates.
bookableUnitSchema.index({ venue: 1, slotTemplate: 1, unitDate: 1 }, { unique: true });

module.exports = mongoose.model("BookableUnit", bookableUnitSchema, "bookableUnits");
