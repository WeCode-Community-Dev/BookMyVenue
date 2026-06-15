import mongoose from "mongoose";
import { UserRole } from "../../../domain/enums/UserRole.enum.js";

const vendorSchema = new mongoose.Schema(
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
        phone: {
            type: String,
            required: true,
            unique: true
        },
        businessName: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.VENDOR
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isApproved: {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: [String],
            default: [],
            select: false
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Vendor", vendorSchema);
