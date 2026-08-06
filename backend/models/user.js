const mongoose = require("mongoose");
const { USER_ROLE_VALUES } = require("../constants/user");

const userSchema = new mongoose.Schema(
   {
      // Google's stable account id (the "sub" claim). Stored as supplementary
      // data; email is the primary identity key
      googleId: { type: String },

      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
      },
      password: { type: String },
      name: { type: String, trim: true, default: "" },
      // Profile picture URL provided by Google.
      picture: { type: String, trim: true, default: "" },

      role: {
         type: String,
         enum: USER_ROLE_VALUES,
         index: true,
      },

      // Soft-delete marker. null = active
      deletedAt: { type: Date, default: null },
   },
   { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");
