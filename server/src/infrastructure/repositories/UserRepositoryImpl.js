import UserRepository from "../../domain/repositories/UserRepository.js";
import UserModel from "../database/models/UserModel.js";

class UserRepositoryImpl extends UserRepository {

    async create(data) {
        return await UserModel.create(data);
    }

    async findById(id) {
        return await UserModel.findById(id);
    }

    async findAll() {
        return await UserModel.find();
    }

    async update(id, data) {
        return await UserModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await UserModel.findByIdAndDelete(id);
    }

    async findByEmail(email, includePassword = false) {
        const query = UserModel.findOne({ email });
        if (includePassword) query.select('+password');
        return await query;
    }

    async findByPhone(phone) {
        return await UserModel.findOne({ phone });
    }
}

export default UserRepositoryImpl;