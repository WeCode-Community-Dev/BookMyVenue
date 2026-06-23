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
            isApproved: doc.isApproved,
            isDeleted: doc.isDeleted,
            refreshToken: doc.refreshToken,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
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
            isApproved: entity.isApproved,
            isDeleted: entity.isDeleted,
            refreshToken: entity.refreshToken,
            approvalStatus:entity.approvalStatus,
            rejectionReason:entity.rejectionReason,
        };
    }
}