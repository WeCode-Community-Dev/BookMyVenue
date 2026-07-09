import { VendorApprovalStatus } from "../enums/VendorApprovalStatus.enum.js";

export class VendorEntity {
    constructor({
        id,
        fullName,
        email,
        phone,
        password,
        profileImage = { publicId: "", url: "" },
        companyName = "",
        address = { addressLine1: "", city: "", state: "", pincode: "" },
        bio = "",
        role,
        // businessName,
        resetToken,
        resetTokenExpiry,
        isVerified = false,
        isBlocked = false,
        isDeleted = false,
        refreshToken = [],
        approvalStatus = VendorApprovalStatus.PENDING,
        rejectionReason = null,
    }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.profileImage = profileImage;
        this.companyName = companyName;
        this.address = address;
        this.bio = bio;
        this.role = role;
        // this.businessName = businessName;
        this.isVerified = isVerified;
        this.resetToken = resetToken;
        this.resetTokenExpiry = resetTokenExpiry;
        this.isBlocked = isBlocked;
        this.isDeleted = isDeleted;
        this.refreshToken = refreshToken;
        this.approvalStatus = approvalStatus;
        this.rejectionReason = rejectionReason;
    }
}
