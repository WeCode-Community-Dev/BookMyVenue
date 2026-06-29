export class IVendorRepository {
    async create(data) {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findAll() {
        throw new Error('Method not implemented');
    }

    async findAllFiltered(query={}) {
        throw new Error('Method not implemented');
    }

    async approveVendor(vendorId){
        throw new Error('Method not implemented');
    }
    
    async rejectVendor(vendorId,reason){
        throw new Error('Method not implemented');
    }
    

    //Admin block/unblock vendor
    async updateBlockStatus(vendorId, isBlocked) {
        throw new Error('Method not implemented');
    }

    async update(id, data) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async softDelete(id) {
        throw new Error('Method not implemented');
    }

    async findByEmail(email, includePassword = false) {
        throw new Error('Method not implemented');
    }

    async findByPhone(phone) {
        throw new Error('Method not implemented');
    }

    async updateRefreshToken(vendorId, refreshToken) {
        throw new Error('Method not implemented');
    }
}