import { IVendorRepository } from "../../domain/repositories/IVendor.repository.js";
import VendorModel from "../database/models/Vendor.model.js";
import VendorMapper from "../../application/mapper/VendorMapper.js";

class VendorRepositoryImpl extends IVendorRepository {

    async create(entity) {
        const doc = await VendorModel.create(VendorMapper.toPersistence(entity));
        return VendorMapper.toDomain(doc);
    }

    async findById(id) {
        const doc = await VendorModel.findOne({ _id: id, isDeleted: false });
        if (!doc) return null;
        return VendorMapper.toDomain(doc);
    }

    async findAll() {
        const docs = await VendorModel.find({ isDeleted: false });
        return docs.map((doc) => VendorMapper.toDomain(doc));
    }

    async update(id, entity) {
        const doc = await VendorModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            VendorMapper.toPersistence(entity),
            { new: true }
        );
        if (!doc) return null;
        return VendorMapper.toDomain(doc);
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
        return VendorMapper.toDomain(doc);
    }

    async findByEmail(email, includePassword = false) {
        const query = VendorModel.findOne({ email, isDeleted: false });
        if (includePassword) query.select("+password");
        const doc = await query;
        if (!doc) return null;
        return VendorMapper.toDomain(doc);
    }

    async findByPhone(phone) {
        const doc = await VendorModel.findOne({ phone, isDeleted: false });
        if (!doc) return null;
        return VendorMapper.toDomain(doc);
    }

    async findByRefreshToken(refreshToken) {
        const doc = await VendorModel.findOne({ refreshToken, isDeleted: false }).select("+password");
        if (!doc) return null;
        return VendorMapper.toDomain(doc);
    }

    async updateRefreshToken(vendorId, refreshToken) {
        const doc = await VendorModel.findByIdAndUpdate(
            vendorId,
            { refreshToken },
            { new: true }
        );
        if (!doc) return null;
        return VendorMapper.toDomain(doc);
    }
}

export default VendorRepositoryImpl;
