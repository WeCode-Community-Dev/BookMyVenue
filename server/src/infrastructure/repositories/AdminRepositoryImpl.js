import AdminRepository from "../../domain/repositories/AdminRepository.js";
import AdminModel from "../database/models/AdminModel.js";

class AdminRepositoryImpl extends AdminRepository {

    async create(data) {
        return await AdminModel.create(data);
    }

    async findById(id) {
        return await AdminModel.findById(id);
    }

    async findAll() {
        return await AdminModel.find();
    }

    async update(id, data) {
        return await AdminModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await AdminModel.findByIdAndDelete(id);
    }

    async findByEmail(email, includePassword = false) {
        const query = AdminModel.findOne({ email });
        if (includePassword) query.select("+password");
        return await query;
    }
}

export default AdminRepositoryImpl;
