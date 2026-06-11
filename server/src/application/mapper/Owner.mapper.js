import {OwnerEnity} from "../../domain/entities/Owner.js";

export class OwnerMapper {

    static mapToEntity(doc) {
        return new OwnerEntity({
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