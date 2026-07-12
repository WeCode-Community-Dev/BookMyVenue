import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "banquet hall",
        "auditorium",
        "convention center",
        "outdoor",
        "rooftop",
        "resort",
        "hotel ballroom",
        "community hall",
        "wedding hall",
        "conference room",
      ],
      required: [true, "Venue category is required"],
    },

    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },

    town: {
      type: String,
      required: [true, "Town/Area is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: [true, "Coordinates are required"],
        validate: {
          validator: function (value) {
            return value.length === 2;
          },
          message: "Coordinates must contain longitude and latitude",
        },
      },
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    pricing: {
      basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Base price cannot be negative"],
      },
      currency: {
        type: String,
        default: "INR",
      },
      pricingModel: {
        type: String,
        enum: ["per_day", "per_hour", "per_event"],
        default: "per_day",
      },
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    contactInfo: {
      phone: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isSeed: {
      type: Boolean,
      default: false,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

venueSchema.index({ location: "2dsphere" });
venueSchema.index({ name: "text", town: "text", district: "text" });

const Venue = mongoose.model("Venue", venueSchema);

export default Venue;