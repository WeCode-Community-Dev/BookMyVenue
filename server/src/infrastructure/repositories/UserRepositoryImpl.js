import UserRepository from "../../domain/repositories/IUserRepository.js";
import UserModel from "../database/models/UserModel.js";

class UserRepositoryImpl extends UserRepository {

    async create(data) {
        return await UserModel.create(data);
    }

    async findById(id) {
        return await UserModel.findOne({ _id: id, isDeleted: false });
    }

    async findAll() {
        return await UserModel.find({ isDeleted: false });
    }

    async update(id, data) {
        return await UserModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            data,
            { new: true }
        );
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }

    async softDelete(id) {
        return await UserModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
    }

    async findByEmail(email, includePassword = false) {
        const query = UserModel.findOne({ email, isDeleted: false });
        if (includePassword) query.select("+password");
        return await query;
    }

    async findByPhone(phone) {
        return await UserModel.findOne({ phone, isDeleted: false });
    }
}

export default UserRepositoryImpl;
