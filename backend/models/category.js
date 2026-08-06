const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
   {
      identifier: {
         type: String,
         required: true,
         trim: true,
         lowercase: true,
         unique: true,
      },

      // Human-readable label shown on the frontend
      name: { type: String, required: true, trim: true },

      /*
         Soft on/off switch so an admin can retire a category without deleting it
         (and without orphaning venues that already reference it).
      */
      isActive: { type: Boolean, default: true },

      // Soft-delete marker. null = live.
      deletedAt: { type: Date, default: null },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema, "categories");
