import { UserMapper } from "../../application/mapper/User.mapper.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { UserModel } from "../database/User.model.js";

export class UserRepository extends IUserRepository {

    async create(user) {
        const data = UserMapper.mapToPersistence(user);

        const document = await UserModel.create(data);

        return UserMapper.mapToEntity(document);
    }

    async findById(id) {
        const document = await UserModel.findById(id);

        if (!document) return null;

        return UserMapper.mapToEntity(document);
    }

    async findByEmail(email, includePassword = false) {
        let query = UserModel.findOne({
            email,
            isDeleted: false,
        });

        if (includePassword) {
            query = query.select("+password");
        }

        const document = await query;

        if (!document) return null;

        return UserMapper.mapToEntity(document);
    }

    async findByPhone(phone) {
        const document = await UserModel.findOne({
            phone,
            isDeleted: false,
        });

        if (!document) return null;

        return UserMapper.mapToEntity(document);
    }

    async findAll() {
        const documents = await UserModel.find({
            isDeleted: false,
        }).sort({ createdAt: -1 });

        return documents.map((doc) =>
            UserMapper.mapToEntity(doc)
        );
    }

    async update(id, user) {
        const data = UserMapper.mapToPersistence(user);

        const document = await UserModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        if (!document) return null;

        return UserMapper.mapToEntity(document);
    }

    async updateRefreshToken(userId, refreshToken) {
        const document = await UserModel.findByIdAndUpdate(
            userId,
            { refreshToken },
            { new: true }
        );

        if (!document) return null;

        return UserMapper.mapToEntity(document);
    }

    async softDelete(id) {
        const document = await UserModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!document) return null;

        return UserMapper.mapToEntity(document);
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }
}