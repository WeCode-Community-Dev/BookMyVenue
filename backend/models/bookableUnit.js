const mongoose = require("mongoose");

const BOOKABLE_UNIT_STATUSES = ["AVAILABLE", "HELD", "BOOKED"];

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

      // Only meaningful while status is HELD. A HELD unit whose heldUntil has
      // passed is treated as AVAILABLE everywhere it's read or claimed — no
      // sweeper job flips it back; expiry is enforced at read/claim time.
      heldUntil: { type: Date, default: null },

      // Snapshotted from the SlotTemplate at the moment this unit is claimed
      // (FROM AVAILABLE/expired-HELD TO HELD), and never touched again once the
      // unit is BOOKED — so a booking's per-slot label/price stays accurate
      // even if the owner edits the slot template afterward, and callers
      // don't need to populate slotTemplate just to display an already-held
      // or already-booked unit. Every successful claim overwrites this
      // unconditionally, even if a stale value already exists from a
      // previous, since-expired hold.
      slotTemplateDetailsWhileBooking: {
         type: new mongoose.Schema(
            {
               label: { type: String, required: true },
               price: { type: Number, required: true },
            },
            { _id: false }
         ),
         default: null,
      },
   },
   { timestamps: true }
);

// One unit per slot per date — the materialization job relies on this to be
// safely re-run without creating duplicates.
bookableUnitSchema.index({ venue: 1, slotTemplate: 1, unitDate: 1 }, { unique: true });

module.exports = mongoose.model("BookableUnit", bookableUnitSchema, "bookableUnits");
