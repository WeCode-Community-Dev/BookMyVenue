import mongoose from "mongoose";
import UserRole from "../../../domain/enums/userRole.js";

const adminSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.ADMIN
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Admin", adminSchema);
