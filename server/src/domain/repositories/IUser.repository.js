export class IUserRepository {
    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findAllFiltered(query={}) {
        throw new Error('Method not implemented');
    }

    async blockUser(id) {
        throw new Error('Method not implemented');
    }

    async unblockUser(id) {
        throw new Error('Method not implemented');
    }

    async create(data) {
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

    async updateRefreshToken(userId, refreshToken) {
        throw new Error('Method not implemented');
    }

}
