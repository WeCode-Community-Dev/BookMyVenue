import { UserMapper } from "../../application/mapper/User.mapper.js";
import { IUserRepository } from "../../domain/repositories/IUser.repository.js";
import { UserModel } from "../database/models/User.model.js"

export class UserRepository extends IUserRepository {

    async findById(id) {
        const document = await UserModel.findById(id);

        if (!document) return null;

        return UserMapper.mapToEntity(document);
    }

    async findAllFiltered(query = {}) {

        const filter = {};

        if (query.search) {

            filter.$or = [
                {
                    fullName: {
                        $regex: query.search,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: query.search,
                        $options: "i"
                    }
                }
            ];

        }
        if (query.isBlocked !== undefined) {
            filter.isBlocked =
                query.isBlocked === "true";
        }

        const page = query.page;
        const limit = query.limit;

        const skip =
            limit * (page - 1);

        const totalCount =
            await UserModel.countDocuments(filter);

        const totalPages =
            Math.ceil(totalCount / limit);

        const documents =
            await UserModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

        return {
            data: documents.map(doc =>
                UserMapper.mapToEntity(doc)
            ),
            totalCount,
            totalPages
        };
    }

    async updateBlockStatus(id, isBlocked) {
        const document =
            await UserModel.findByIdAndUpdate(
                id,
                {
                    isBlocked
                },
                {
                    new: true
                }
            );

        if (!document) return null;
        console.log(document)

        return UserMapper.mapToEntity(document);
    }

    async create(user) {
        const data = UserMapper.mapToPersistence(user);

        const document = await UserModel.create(data);

        return UserMapper.mapToEntity(document);
    }

    async findByEmail(email) {
        let document = await UserModel.findOne({
            email,
            isDeleted: { $ne: true }
        });

        if (!document) return null;

        // console.log('from repo: ', document)
        return UserMapper.mapToEntity(document);
    }

    async verifyOtp(userId) {
        const document = await UserModel.findByIdAndUpdate(
            userId,
            {
                isOtpVerified: true,
            },
            {
                new: true
            }
        );

        if (!document) return null;

        return UserMapper.mapToEntity(document);
    }

    async findByPhone(phone) {
        const document = await UserModel.findOne({
            phone,
            isDeleted: { $ne: true }
        });

        if (!document) return null;

        return UserMapper.mapToEntity(document);
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

    async findByRefreshToken(refreshToken) {
        const document = await UserModel.findOne({
            refreshToken,
            isDeleted: { $ne: true }
        }).select("+password");

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

    async clearRefreshToken(token) {
        await UserModel.findByOneAndUpdate(
            {refreshToken: token},
            { $pull: {refreshToken: token } },
            { new: true }
        );
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

    async findByGoogleId(googleId) {
        const document = await UserModel.findOne({
            googleId,
            isDeleted: { $ne: true }
        }).select('+googleId');

        if (!document) return null;

        return UserMapper.mapToEntity(document);
    }
}