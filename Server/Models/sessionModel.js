import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  hashedRefreshToken: {
    type: String,
    require: true,
  },
  ip: {
    type: String,
    require: true,
  },
  userAgent: {
    type: String,
    require: true,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
});

export const sessionModel = mongoose.model("session", sessionSchema);
