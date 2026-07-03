import mongoose from "mongoose";
import { UserRole } from "../../../domain/enums/UserRole.enum.js";
const userSchema = new mongoose.Schema({
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
        unique: true,
        sparse: true,
        default: null
    },
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        default: null,
        select: false
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.CUSTOMER
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    otpCode: {
        type: String,
        select: false
    },
    otpExpiresAt: {
        type: Date,
        select: false
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
    },
    resetToken: {
        type: String,
        select: false
    },
    resetTokenExpiry: {
        type: Date,
        select: false
    }

},
    {
        timestamps: true
    })


export const UserModel = mongoose.model("User", userSchema)

