export class IVenueRepository {
    async create(venue) {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async update(id, data) {
        throw new Error('Method not implemented');
    }

    async findByVendorAndName(vendorId, name) {
        throw new Error('Method not implemented');
    }

    // kept for backward compat with develop usecases that call findByOwnerAndName
    async findByOwnerAndName(vendorId, name) {
        return this.findByVendorAndName(vendorId, name);
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async findAllFiltered(query = {}) {
        throw new Error('Method not implemented');
    }

    async approveVenue(id) {
        throw new Error('Method not implemented');
    }

    async rejectVenue(id, reason) {
        throw new Error('Method not implemented');
    }

    async updateBlockStatus(id, isBlocked) {
        throw new Error('Method not implemented');
    }

    async countByOwnerId(ownerId) {
        throw new Error("Method not implemented");
    }
}
