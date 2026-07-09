import { VendorEntity } from "../../domain/entities/Vendor.js";

export class VendorMapper {

    static mapToEntity(doc) {

        if (!doc) return null;

        return new VendorEntity({
            id: doc._id?.toString(),
            fullName: doc.fullName,
            email: doc.email,
            phone: doc.phone,
            password: doc.password,
            profileImage: doc.profileImage,
            companyName: doc.companyName,
            address: doc.address,
            bio: doc.bio,
            role: doc.role,
            isDeleted: doc.isDeleted,
            isVerified: doc.isVerified,
            refreshToken: doc.refreshToken,
            resetToken: doc.resetToken,
            resetTokenExpiry: doc.resetTokenExpiry,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            isBlocked:doc.isBlocked,
            approvalStatus:doc.approvalStatus,
            rejectionReason:doc.rejectionReason,
        });
    }

    static mapToPersistence(entity) {

        if (!entity) return null;

        return {
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            password: entity.password,
            profileImage: entity.profileImage,
            companyName: entity.companyName,
            address: entity.address,
            bio: entity.bio,
            role: entity.role,
            isDeleted: entity.isDeleted,
            isVerified: entity.isVerified,
            refreshToken: entity.refreshToken,
            resetToken: entity.resetToken,
            resetTokenExpiry: entity.resetTokenExpiry,
            isBlocked:entity.isBlocked,
            approvalStatus:entity.approvalStatus,
            rejectionReason:entity.rejectionReason,
        };
    }
}