import { IVendorRepository } from "../../domain/repositories/IVendor.repository.js";
import VendorModel from "../database/models/Vendor.model.js";
import { VendorMapper } from "../../application/mapper/Vendor.mapper.js";

class VendorRepositoryImpl extends IVendorRepository {

    async create(entity) {
        const doc = await VendorModel.create(VendorMapper.mapToPersistence(entity));
        return VendorMapper.mapToEntity(doc);
    }

    async findById(id){
        const document = await VendorModel.findById(id)

        if(!document) return null
        return VendorMapper.mapToEntity(document)
    }

    async findAll() {
        const docs = await VendorModel.find({ isDeleted: false });
        return docs.map((doc) => VendorMapper.mapToEntity(doc));
    }

    async findAllFiltered(query = {}) {

        const filter = {}

        if (query.search) {
            filter.$or = [
                {
                    name: {
                        $regex: query.search,
                        $options: "i"
                    }
                }
            ]
        }

        if (query.status) {
            filter.approvalStatus = query.status
        }

        const skip =
            query.limit * (query.page - 1)

        const totalCount =
            await VendorModel.countDocuments(filter)

        const totalPages =
            Math.ceil(totalCount / query.limit)

        const documents =
            await VendorModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(query.limit)

        return {
            data: documents.map(doc =>
                VendorMapper.mapToEntity(doc)
            ),
            totalCount,
            totalPages
        }
    }

    async updateApprovalStatus(
        vendorId,
        status,
        reason
    ) {

        const document =
            await VendorModel.findByIdAndUpdate(
                vendorId,
                {
                    approvalStatus: status,
                    rejectionReason:
                        status === "REJECTED"
                            ? reason
                            : null
                },
                {
                    returnDocument: "after"
                }
            )

        if (!document) return null

        return VendorMapper.mapToEntity(document)
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
