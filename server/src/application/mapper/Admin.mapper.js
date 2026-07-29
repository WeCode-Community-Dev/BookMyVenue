import {AdminEntity} from "../../domain/entities/Admin.js";

export class AdminMapper {

    static mapToEntity(doc) {
        return new AdminEntity({
            id: doc._id?.toString(),
            fullName: doc.fullName,
            email: doc.email,
            password: doc.password,
            role: doc.role,
            isDeleted: doc.isDeleted,
            refreshToken: doc.refreshToken,
            // isActive: doc.isActive,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }

    static mapToPersistence(entity) {
        return {
            fullName: entity.fullName,
            email: entity.email,
            password: entity.password,
            role: entity.role,
            isDeleted: entity.isDeleted,
            refreshToken: entity.refreshToken
            // isActive: entity.isActive,
        };
    }
}