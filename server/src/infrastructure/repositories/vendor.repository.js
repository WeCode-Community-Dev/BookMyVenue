import { IVendorRepository } from "../../domain/repositories/IVendor.repository.js";
import VendorModel from "../database/models/Vendor.model.js";
import { VendorMapper } from "../../application/mapper/Vendor.mapper.js";
import { VendorApprovalStatus } from "../../domain/enums/VendorApprovalStatus.enum.js";

class VendorRepositoryImpl extends IVendorRepository {

    async create(entity) {
        const doc = await VendorModel.create(VendorMapper.mapToPersistence(entity));
        return VendorMapper.mapToEntity(doc);
    }

    async findById(id) {
        const document = await VendorModel.findById(id);
        if (!document) return null;
        return VendorMapper.mapToEntity(document);
    }

    async findAll() {
        const docs = await VendorModel.find({ isDeleted: false });
        return docs.map((doc) => VendorMapper.mapToEntity(doc));
    }

    async updatePassword(
        vendorId,
        hashedPassword
    ) {
        await VendorModel.findByIdAndUpdate(
            vendorId,
            {
                password: hashedPassword
            }
        );
    }

    async findAllFiltered(query = {}) {
        const filter = {};

            // Search
    if (query.search) {
        filter.$or = [
            {
                fullName: {
                    $regex: query.search,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: query.search,
                    $options: "i",
                },
            },
            {
                companyName: {
                    $regex: query.search,
                    $options: "i",
                },
            },
        ];
    }

    // Approval Status
    if (query.status) {
        filter.approvalStatus = query.status;
    }

    // Block / Unblock Filter
    if (query.isBlocked !== undefined) {
        filter.isBlocked =
            query.isBlocked === true ||
            query.isBlocked === "true";
    }
            console.log("Query:", query);
            console.log("Filter:", filter);

        const skip = query.limit * (query.page - 1);
        const totalCount = await VendorModel.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / query.limit);
        const documents = await VendorModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(query.limit);

        return {
            data: documents.map(doc => VendorMapper.mapToEntity(doc)),
            totalCount,
            totalPages
        };
    }

    async verifyOtp(vendorId) {
        const document = await VendorModel.findByIdAndUpdate(
            vendorId,
            {
                isVerified: true,
            },
            {
                new: true
            }
        );

        if (!document) return null;

        return VendorMapper.mapToEntity(document);
    }

    async approveVendor(vendorId) {
        const updatedVendor = await VendorModel.findByIdAndUpdate(
            vendorId,
            { approvalStatus: VendorApprovalStatus.APPROVED, rejectionReason: null },
            { new: true }
        );
        if (!updatedVendor) return null;
        return VendorMapper.mapToEntity(updatedVendor);
    }

    async rejectVendor(vendorId, reason) {
        const updatedVendor = await VendorModel.findByIdAndUpdate(
            vendorId,
            { approvalStatus: VendorApprovalStatus.REJECTED, rejectionReason: reason },
            { new: true }
        );
        if (!updatedVendor) return null;
        return VendorMapper.mapToEntity(updatedVendor);
    }

    async updateBlockStatus(vendorId, isBlocked) {
        const document = await VendorModel.findByIdAndUpdate(
            vendorId,
            { isBlocked },
            { new: true }
        );
        if (!document) return null;
        return VendorMapper.mapToEntity(document);
    }

    async update(id, entity) {
        const doc = await VendorModel.findOneAndUpdate(
            { _id: id, isDeleted: false },
            VendorMapper.mapToPersistence(entity),
            { new: true }
        );
        if (!doc) return null;
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
        return doc ? VendorMapper.mapToEntity(doc) : null;
    }

    async findByEmail(email) {
        const doc = await VendorModel.findOne({ 
            email, 
            isDeleted: {$ne: true}
        });
        if(!doc){
            return null
        }

        return VendorMapper.mapToEntity(doc)
    }

    async findByPhone(phone) {
        const doc = await VendorModel.findOne({ phone, isDeleted: false });
        return doc ? VendorMapper.mapToEntity(doc) : null;
    }

    async findByRefreshToken(refreshToken) {
        const doc = await VendorModel.findOne({ refreshToken, isDeleted: false }).select("+password");
        if (!doc) return null;
        return VendorMapper.mapToEntity(doc);
    }

    async updateRefreshToken(vendorId, refreshToken) {
        const doc = await VendorModel.findByIdAndUpdate(
            vendorId,
            { $push: {refreshToken} },
            { new: true }
        );
        if (!doc) return null;
        return VendorMapper.mapToEntity(doc);
    }

    async clearRefreshToken(token) {
        await VendorModel.findByOneAndUpdate(
            {refreshToken: token},
            { $pull: {refreshToken: token } },
            { new: true }
        );
    }
}

export default VendorRepositoryImpl;
