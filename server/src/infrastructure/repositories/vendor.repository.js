import {IVendorRepository} from "../../domain/repositories/IVendor.repository.js";
import VendorModel from "../database/models/Vendor.model.js";
import {VendorMapper} from "../../application/mapper/Vendor.mapper.js";

class VendorRepositoryImpl extends IVendorRepository {

    async create(entity) {
        const doc = await VendorModel.create(VendorMapper.mapToPersistence(entity));
        return VendorMapper.mapToEntity(doc);
    }

    async findById(id) {
        const doc = await VendorModel.findOne({ _id: id, isDeleted: false });
        return doc ? VendorMapper.mapToEntity(doc) : null;
    }

    async findAll() {
        const docs = await VendorModel.find({ isDeleted: false });
        return docs.map((doc) => VendorMapper.mapToEntity(doc));
    }

    async update(id, entity) {
        const doc = await VendorModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            VendorMapper.mapToPersistence(entity),
            { new: true }
        );
        return VendorMapper.mapToEntity(doc);
    }

    async delete(id) {
        return await VendorModel.findByIdAndDelete(id);
    }

    async softDelete(id) {
        const doc = await VendorModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        return VendorMapper.mapToEntity(doc);
    }

    async findByEmail(email, includePassword = false) {
        const query = VendorModel.findOne({ email, isDeleted: false });
        if (includePassword) query.select("+password");
        const doc = await query;
        return doc ? VendorMapper.mapToEntity(doc) : null;
    }

    async findByPhone(phone) {
        const doc = await VendorModel.findOne({ phone, isDeleted: false });
        return doc ? VendorMapper.mapToEntity(doc) : null;
    }
}

export default VendorRepositoryImpl;
