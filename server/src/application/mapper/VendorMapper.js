class VendorMapper {
    toDTO(vendor) {
        if (!vendor) return null;

        const obj = vendor.toObject ? vendor.toObject() : { ...vendor };

        return {
            id: obj._id,
            fullName: obj.fullName,
            email: obj.email,
            phone: obj.phone,
            role: obj.role,
            isApproved: obj.isApproved,
            isBlocked: obj.isBlocked,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt
        };
    }

    toDTOList(vendors) {
        return vendors.map((vendor) => this.toDTO(vendor));
    }
}

export default new VendorMapper();
