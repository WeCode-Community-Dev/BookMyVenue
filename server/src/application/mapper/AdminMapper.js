class AdminMapper {
    toDTO(admin) {
        if (!admin) return null;

        const obj = admin.toObject ? admin.toObject() : { ...admin };

        return {
            id: obj._id,
            fullName: obj.fullName,
            email: obj.email,
            role: obj.role,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt
        };
    }

    toDTOList(admins) {
        return admins.map((admin) => this.toDTO(admin));
    }
}

export default new AdminMapper();
