import {UserEntity} from "../../domain/entities/User.js";

export class UserMapper {

    static mapToEntity(doc) {
        return new UserEntity({
            id: doc._id?.toString(),
            fullName: doc.fullName,
            email: doc.email,
            phone: doc.phone,
            password: doc.password,
            role: doc.role,
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
            role: entity.role,
            isDeleted: entity.isDeleted,
            refreshToken: entity.refreshToken
        };
    }
}