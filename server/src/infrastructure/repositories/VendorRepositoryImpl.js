import VendorRepository from "../../domain/repositories/VendorRepository.js";
import VendorModel from "../database/models/VendorModel.js";

class VendorRepositoryImpl extends VendorRepository {

    async create(data) {
        return await VendorModel.create(data);
    }

    async findById(id) {
        return await VendorModel.findById(id);
    }

    async findAll() {
        return await VendorModel.find();
    }

    async update(id, data) {
        return await VendorModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await VendorModel.findByIdAndDelete(id);
    }

    async findByEmail(email, includePassword = false) {
        const query = VendorModel.findOne({ email });
        if (includePassword) query.select("+password");
        return await query;
    }

    async findByPhone(phone) {
        return await VendorModel.findOne({ phone });
    }
}

export default VendorRepositoryImpl;
