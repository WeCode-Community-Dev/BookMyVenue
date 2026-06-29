import mongoose from "mongoose";
import UserRole from "../../../domain/enums/UserRole.enum.js";
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
        default: UserRole.CUSTOMER
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: [String],
        default: [],
        select: false
    },
    profileImage: {
    type: String,
    default: ""
    },

    pendingEmail: {
        type: String,
        default: null
    },

    otpCode: {
        type: String,
        default: null,
        select: false
    },

    otpExpiresAt: {
        type: Date,
        default: null
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue"
        }],

    },
    {
        timestamps: true
    })


export const UserModel = mongoose.model("User", userSchema)

