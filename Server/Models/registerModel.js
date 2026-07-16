import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  number: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["user", "organizer", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

export const userModel = mongoose.model("users", userSchema);
