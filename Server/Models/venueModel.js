import mongoose from "mongoose";

const specSchema = mongoose.Schema(
  {
    spec: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const slotSchema = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { _id: true },
);

const venueSchema = mongoose.Schema(
  {
    organiZerId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    rating: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    capacity: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    spec: {
      type: [specSchema],
      required: true,
    },
    slots: {
      type: [slotSchema],
      required: true,
    },
    isApproved: {
      type: String,
      enum: ["no", "yes"],
      default: "no",
    },
  },
  { timestamps: true },
);

export const venueModel = mongoose.model("venues", venueSchema);
