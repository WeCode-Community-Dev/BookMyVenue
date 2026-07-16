import mongoose from "mongoose";

const otpSchema =  mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User is required"],
    },
    otpHash: {
      type: String,
      required: [true, "OTP hash is required"],
    },
  },
  {
    timestamps: true,
  },
);

export const otpModel = mongoose.model("otp", otpSchema);
