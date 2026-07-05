const mongoose = require("mongoose");
const {
   VENUE_STATUS_VALUES,
   VENUE_STATUSES,
   HISTORY_ACTION_VALUES,
} = require("../constants/venue");

// Embedded image reference. MVP stores plain URLs only (no upload pipeline for now)
const venueImageSchema = new mongoose.Schema(
   {
      url: { type: String, required: true, trim: true },
      sortOrder: { type: Number, default: 0 },
      isCover: { type: Boolean, default: false },
   },
   { _id: false }
);

// One admin decision on this venue. APPROVAL entries stamp the version the
// approval produced; REJECTION entries carry the reason shown to the owner. The
// full log lives on the surviving/original doc (an approved edit copy is
// hard-deleted, so its decisions are recorded on the original it merged into).
const editHistorySchema = new mongoose.Schema(
   {
      action: { type: String, enum: HISTORY_ACTION_VALUES, required: true },
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      at: { type: Date, required: true },
      version: { type: Number, required: true },
      // Only set on REJECTION entries.
      rejectionReason: { type: String, trim: true },
   },
   { _id: false }
);

const venueSchema = new mongoose.Schema(
   {
      // venueOwner id — required by the data model, but auth/venue owner isn't built yet.
      // Kept optional for now so seed data can exist before the User collection does.
      venueOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

      // Set on an EDIT COPY only: points to the original APPROVED venue this copy
      // edits. null on every normal venue.
      // Required to (a) link copy-> original for
      // the merge, (b) exclude copies from the venue owner's venue list, (c) tell a new
      // PENDING venue apart from an edit awaiting re-approval.
      editOf: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Venue",
         default: null,
         index: true,
      },

      name: { type: String, trim: true, default: "" },
      description: { type: String, trim: true, default: "" },
      // References the Category collection (admin-managed).
      venueCategory: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category",
         default: null,
         index: true,
      },
      // References the Amenity collection (admin-managed). A venue may offer many
      // amenities, so this is an array of refs (unlike the single venueCategory).
      amenities: {
         type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity" }],
         default: [],
      },
      capacity: { type: Number, min: 0 },

      // Address fields.
      addressLine: { type: String, trim: true, default: "" },
      city: { type: String, trim: true },
      district: { type: String, trim: true, index: true },
      state: { type: String, trim: true, default: "Kerala" },
      pincode: { type: String, trim: true },

      // GeoJSON Point: [longitude, latitude]. Shaped for the Phase-1 radius
      // search ("venues near me"); the 2dsphere index will be added later.
      location: {
         type: { type: String, enum: ["Point"], default: "Point" },
         coordinates: { type: [Number], default: undefined }, // [lng, lat]
      },

      basePrice: { type: Number, min: 0, default: null },

      images: { type: [venueImageSchema], default: [] },

      // Listing lifecycle. New venues start PENDING; only APPROVED is public.
      status: {
         type: String,
         enum: VENUE_STATUS_VALUES,
         default: VENUE_STATUSES.DRAFT,
         index: true,
      },

      // Venue owner-controlled visibility toggle, orthogonal to `status`.
      // false = venue owner disabled the listing; hidden from public but not deleted.
      isActive: { type: Boolean, default: true },

      // Set by admin on rejection (admin endpoints come later). Surfaced to the venue owner.
      rejectionReason: { type: String, trim: true, default: "" },

      // Live version counter. 0 = the DRAFT document (never approved). Increments
      // by 1 on every admin approval — the first approval of a new venue makes it
      // version 1, and each later approved edit-merge bumps it again.
      version: { type: Number, default: 0 },

      // Combined audit log of admin decisions (approvals + rejections) on this
      // venue, in chronological order. See editHistorySchema above.
      editHistory: { type: [editHistorySchema], default: [] },

      // Soft-delete marker. null = live(active).
      deletedAt: { type: Date, default: null },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema, "venues");
