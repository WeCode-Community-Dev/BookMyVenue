import mongoose from "mongoose";

const venueSchema = mongoose.Schema(
  {
    organiZerId: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    place: {
      type: String,
      require: true,
    },
    capacity: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
  },
  { timestamp: true },
);

export const venueModel = mongoose.model("venues", venueSchema)