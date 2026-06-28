import { UserEntity } from "../../domain/entities/User.js";

export class UserMapper {

    static mapToEntity(doc) {
        return new UserEntity({
            id: doc._id?.toString(),
            fullName: doc.fullName,
            email: doc.email,
            phone: doc.phone,
            password: doc.password,
            googleId: doc.googleId ?? null,
            role: doc.role,
            isOtpVerified: doc.isOtpVerified,
            otpCode: doc.otpCode,
            otpExpiresAt: doc.otpExpiresAt,
            isBlocked: doc.isBlocked,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            refreshToken: doc.refreshToken,
            resetToken: doc.resetToken,
            resetTokenExpiry: doc.resetTokenExpiry,
        });
    }

    static mapToPersistence(entity) {
        return {
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            password: entity.password,
            googleId: entity.googleId,
            role: entity.role,
            isOtpVerified: entity.isOtpVerified,
            otpCode: entity.otpCode,
            otpExpiresAt: entity.otpExpiresAt,
            isBlocked: entity.isBlocked,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            refreshToken: entity.refreshToken
        };
    }

    static toDTO(entity) {
        return {
            id: entity.id,
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            role: entity.role,
            isOtpVerified: entity.isOtpVerified,
            isBlocked: entity.isBlocked,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}