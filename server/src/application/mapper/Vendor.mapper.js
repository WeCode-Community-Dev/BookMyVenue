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
            isApproved: doc.isApproved,
            isDeleted: doc.isDeleted,
            refreshToken: doc.refreshToken,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }

    static mapToPersistence(entity) {

        if (!entity) return null;

        return {
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            password: entity.password,
            isApproved: entity.isApproved,
            isDeleted: entity.isDeleted,
            refreshToken: entity.refreshToken
        };
    }
}