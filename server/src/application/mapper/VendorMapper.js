import VendorEntity from "../../domain/entities/Vendor.js";

export default class VendorMapper {
    static toDomain(doc) {
        if (!doc) return null;

        return new VendorEntity({
            id: doc._id?.toString(),
            fullName: doc.fullName,
            email: doc.email,
            phone: doc.phone,
            businessName: doc.businessName,
            password: doc.password,
            role: doc.role,
            isVerified: doc.isVerified,
            isBlocked: doc.isBlocked,
            isAdminApproved: doc.isAdminApproved,
            isDeleted: doc.isDeleted,
            refreshToken: doc.refreshToken,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }

    static toPersistence(entity) {
        return {
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            businessName: entity.businessName,
            password: entity.password,
            role: entity.role,
            isVerified: entity.isVerified,
            isBlocked: entity.isBlocked,
            isAdminApproved: entity.isAdminApproved,
            isDeleted: entity.isDeleted,
            refreshToken: entity.refreshToken,
        };
    }
}
