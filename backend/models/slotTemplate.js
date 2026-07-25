const mongoose = require("mongoose");

const slotTemplateSchema = new mongoose.Schema(
   {
      venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true, index: true },

      // Owner-facing name, e.g. "Morning", "Evening", "Full Day"
      label: { type: String, required: true, trim: true },

      // Clock times as minutes since midnight, e.g. 540 = 09:00, 780 = 13:00.
      // Range (0-1439) validated in the controller.
      startTime: { type: Number, required: true },
      endTime: { type: Number, required: true },

      price: { type: Number, required: true, min: 0 },

      /*
         Soft on/off switch so an owner can retire a slot without deleting it
         (and without orphaning bookings that already reference it).
      */
      isActive: { type: Boolean, default: true },

      // Soft-delete marker. null = live.
      deletedAt: { type: Date, default: null },
   },
   { timestamps: true }
);

module.exports = mongoose.model("SlotTemplate", slotTemplateSchema, "slotTemplates");
