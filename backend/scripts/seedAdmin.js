import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../src/models/userModel.js";

dotenv.config();

const seedAdmin = async () => {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD, MONGO_URI } =
        process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PHONE || !ADMIN_PASSWORD) {
        console.error(
            "Missing required env vars: ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD"
        );
        process.exit(1);
    }

    if (!MONGO_URI) {
        console.error("Missing required env var: MONGO_URI");
        process.exit(1);
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(ADMIN_PASSWORD)) {
        console.error(
            "ADMIN_PASSWORD must be at least 8 characters and include uppercase, lowercase, and a number"
        );
        process.exit(1);
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(ADMIN_PHONE)) {
        console.error("ADMIN_PHONE must be a valid 10-digit Indian mobile number");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("Database connected");

        const existingAdmin = await userModel.findOne({
            email: ADMIN_EMAIL.toLowerCase().trim(),
            roles: "admin",
        });

        if (existingAdmin) {
            console.log(`Admin already exists: ${existingAdmin.email}`);
            await mongoose.disconnect();
            process.exit(0);
        }

        const existingEmail = await userModel.findOne({
            email: ADMIN_EMAIL.toLowerCase().trim(),
        });

        if (existingEmail) {
            if (!existingEmail.roles.includes("admin")) {
                existingEmail.roles.push("admin");
                existingEmail.isEmailVerified = true;
                existingEmail.isActive = true;
                await existingEmail.save();
                console.log(`Admin role added to existing user: ${existingEmail.email}`);
            } else {
                console.log(`Admin already exists: ${existingEmail.email}`);
            }
            await mongoose.disconnect();
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        const admin = await userModel.create({
            name: ADMIN_NAME.trim(),
            email: ADMIN_EMAIL.toLowerCase().trim(),
            phone: ADMIN_PHONE.trim(),
            password: hashedPassword,
            roles: ["admin"],
            isEmailVerified: true,
            isActive: true,
        });

        console.log(`Admin created successfully: ${admin.email}`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Seed admin error:", error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedAdmin();
