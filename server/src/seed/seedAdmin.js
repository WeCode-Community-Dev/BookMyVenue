import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminName = process.env.ADMIN_NAME || "BookMyVenue Admin";

        if(!adminEmail || !adminPassword){
            console.error("admin email and password required in .env!");
            process.exit(1);
        }

        const adminExist = await User.findOne({adminEmail});

        if(adminExist){
            console.log("Admin already exists!");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
        });
        console.log("Admin account seeded successfully..");
        process.exit(0);

    } catch (error) {
        console.error("Failed to seed admin account!", error.message);
        process.exit(1);
    }
}

seedAdmin();
