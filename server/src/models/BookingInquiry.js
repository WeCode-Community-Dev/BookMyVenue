import mongoose from "mongoose";

const bookingInquirySchema = new mongoose.Schema(
  {
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: [true, "Venue is required"],
    },

    // without forcing login. If only logged-in users can inquire, make this required.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Owner of the venue. Useful for owner dashboard inquiry management.
    // For seed venues with no owner, this may be null unless you seed a demo owner.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    customerPhone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    // Store as YYYY-MM-DD string to avoid timezone issues in MVP
    eventDate: {
      type: String,
      required: [true, "Event date is required"],
      validate: {
        validator: function (value) {
          return /^\d{4}-\d{2}-\d{2}$/.test(value);
        },
        message: "Event date must be in YYYY-MM-DD format",
      },
    },

    guestCount: {
      type: Number,
      required: [true, "Guest count is required"],
      min: [1, "Guest count must be at least 1"],
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },
    trackingCode: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Helps venue availability filtering:
// find accepted inquiries for a selected date
bookingInquirySchema.index({ venue: 1, eventDate: 1, status: 1 });

// Prevents double booking:
// only one accepted inquiry is allowed for the same venue on the same date
bookingInquirySchema.index(
  { venue: 1, eventDate: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "accepted" },
  }
);

const BookingInquiry = mongoose.model("BookingInquiry", bookingInquirySchema);

export default BookingInquiry;