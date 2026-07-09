import mongoose from "mongoose";
import { UserRole } from "../../../domain/enums/UserRole.enum.js";


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
        },
        refreshToken: {
            type: [String],
            default: []
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.ADMIN
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Admin", adminSchema);
