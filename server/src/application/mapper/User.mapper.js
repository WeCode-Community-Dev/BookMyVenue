import { use } from "react";
import { UserEntity } from "../../domain/entities/User.js";

export class UserMapper {

    static mapToEntity(doc){
        return new UserEntity({
            id: doc._id.toString(),
            fullName: doc.fullName,
            email: doc.email,
            phone: doc.phone,
            role: doc.role,
            isOtpVerified: doc.isOtpVerified,
            isBlocked: doc.isBlocked,
        })       
    }

    static mapToPersistence(entity){
        return {
            fullName: entity.fullName,
            email: entity.email,
            phone: entity.phone,
            role: entity.role,
            isOtpVerified: entity.isOtpVerified,
            isBlocked: entity.isBlocked
        }
    }
}