import mongoose from "mongoose";
import { UserRole } from "../../../domain/enums/UserRole.enum.js";
import { VendorApprovalStatus } from '../../../domain/enums/VendorApprovalStatus.enum.js'

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
        isBlocked: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        approvalStatus: {
            type: String,
            enum: Object.values(VendorApprovalStatus),
            default: VendorApprovalStatus.PENDING,
        },

        rejectionReason: {
            type: String,
            default: ""
        },
       
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Vendor", vendorSchema);
