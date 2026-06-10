import AdminRepository from "../../domain/repositories/IAdminRepository.js";
import AdminModel from "../database/models/AdminModel.js";

class AdminRepositoryImpl extends AdminRepository {

    async create(data) {
        return await AdminModel.create(data);
    }

    async findById(id) {
        return await AdminModel.findOne({ _id: id, isDeleted: false });
    }

    async findAll() {
        return await AdminModel.find({ isDeleted: false });
    }

    async update(id, data) {
        return await AdminModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            data,
            { new: true }
        );
    }

    async delete(id) {
        return await AdminModel.findByIdAndDelete(id);
    }

    async softDelete(id) {
        return await AdminModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
    }

    async findByEmail(email, includePassword = false) {
        const query = AdminModel.findOne({ email, isDeleted: false });
        if (includePassword) query.select("+password");
        return await query;
    }
}

export default AdminRepositoryImpl;
