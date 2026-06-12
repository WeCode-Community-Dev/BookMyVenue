import { AdminMapper } from "../../application/mapper/Admin.mapper.js";
import { IAdminRepository } from "../../domain/repositories/IAdminRepository.js";
import { AdminModel } from "../database/Admin.model.js";

export class AdminRepository extends IAdminRepository {

    async create(admin) {
        const data = AdminMapper.mapToPersistence(admin);

        const document = await AdminModel.create(data);

        return AdminMapper.mapToEntity(document);
    }

    async findById(id) {
        const document = await AdminModel.findById(id);

        if (!document) return null;

        return AdminMapper.mapToEntity(document);
    }

    async findByEmail(email, includePassword = false) {
        let query = AdminModel.findOne({
            email,
            isDeleted: false,
        });

        if (includePassword) {
            query = query.select("+password");
        }

        const document = await query;

        if (!document) return null;

        return AdminMapper.mapToEntity(document);
    }

    async findAll() {
        const documents = await AdminModel.find({
            isDeleted: false,
        }).sort({ createdAt: -1 });

        return documents.map((doc) =>
            AdminMapper.mapToEntity(doc)
        );
    }

    async update(id, admin) {
        const data = AdminMapper.mapToPersistence(admin);

        const document = await AdminModel.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true }
        );

        if (!document) return null;

        return AdminMapper.mapToEntity(document);
    }

    async softDelete(id) {
        const document = await AdminModel.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
            },
            {
                new: true,
            }
        );

        if (!document) return null;

        return AdminMapper.mapToEntity(document);
    }

    async delete(id) {
        return await AdminModel.findByIdAndDelete(id);
    }
}