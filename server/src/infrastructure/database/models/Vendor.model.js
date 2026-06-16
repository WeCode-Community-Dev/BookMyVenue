import mongoose from "mongoose";
import {UserRole} from "../../../domain/enums/UserRole.enum.js";

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
        password: {
            type: String,
            required: true,
            select: false
        },
        profileImage: {
            publicId: {
                type: String,
                default: ""
            },
            url: {
                type: String,
                default: ""
            }
        },
        companyName: {
            type: String,
            default: ""
        },
        address: {
            addressLine1: {
                type: String,
                default: ""
            },
            city: {
                type: String,
                default: ""
            },
            state: {
                type: String,
                default: ""
            },
            pincode: {
                type: String,
                default: ""
            }
        },
        bio: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.VENDOR
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
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Vendor", vendorSchema);
