// Seeds a single admin user.
//
// Provide credentials via env when running the script:
//   ADMIN_EMAIL=you@admin.com ADMIN_PASSWORD='StrongPass!23'
// Load backend/.env regardless of the directory the script is launched from.
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { connectDB } = require("../config/database");
const Users = require("../models/user");
const { USER_ROLES } = require("../constants/user");

const email = process.env.ADMIN_EMAIL?.toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Platform Admin";

async function seedAdmin() {
   if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD env variables are required.");
   }

   await connectDB();

   const existing = await Users.findOne({ email });
   if (existing) {
      console.log(`Account already exists for ${email} (role: ${existing.role})`);
      return;
   }

   const passwordHash = await bcrypt.hash(password, 10);

   const admin = new Users({
      name,
      email,
      password: passwordHash,
      role: USER_ROLES.ADMIN,
   });
   await admin.save();

   console.log(`Admin created: ${email}`);
}

seedAdmin()
   .catch((error) => {
      console.error("Failed to seed admin:", error.message);
      process.exitCode = 1;
   })
   .finally(() => mongoose.disconnect());
