import VendorRepository from "../../domain/repositories/IVendorRepository.js";
import VendorModel from "../database/models/VendorModel.js";

class VendorRepositoryImpl extends VendorRepository {

    async create(data) {
        return await VendorModel.create(data);
    }

    async findById(id) {
        return await VendorModel.findOne({ _id: id, isDeleted: false });
    }

    async findAll() {
        return await VendorModel.find({ isDeleted: false });
    }

    async update(id, data) {
        return await VendorModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            data,
            { new: true }
        );
    }

    async delete(id) {
        return await VendorModel.findByIdAndDelete(id);
    }

    async softDelete(id) {
        return await VendorModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
    }

    async findByEmail(email, includePassword = false) {
        const query = VendorModel.findOne({ email, isDeleted: false });
        if (includePassword) query.select("+password");
        return await query;
    }

    async findByPhone(phone) {
        return await VendorModel.findOne({ phone, isDeleted: false });
    }
}

export default VendorRepositoryImpl;
