import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  venueId: {
    type: String,
    required: true,
  },
  organizerId: {
    type: String,
    required: true,
  },
  venueName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  bookedRanges: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, default: null },
    },
  ],
});

export const bookingModel = mongoose.model("bookings", bookingSchema);
