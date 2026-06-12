import mongoose from "mongoose";

const guestSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    venueId: {
      type: String,
      require: true,
    },
    guestName: {
      type: String,
      require: true,
    },
    guestMail: {
      type: String,
      require: true,
    },
    guestNumber: {
      type: String,
      require: true,
    },
  },
  { timestamp: true },
);

const guestModel = mongoose.model("guest", guestSchema)