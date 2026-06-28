export class IUserRepository {
    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findAllFiltered(query = {}) {
        throw new Error('Method not implemented');
    }

    async updateBlockStatus(id, isBlocked) {
        throw new Error('Method not implemented');
    }

    async create(data) {
        throw new Error('Method not implemented');
    }

    async update(id, data) {
        throw new Error('Method not implemented');
    }

    async verifyOtp(userId) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error('Method not implemented');
    }

    async softDelete(id) {
        throw new Error('Method not implemented');
    }

    async findByEmail(email, includePassword = false, includeOtp = false) {
        throw new Error('Method not implemented');
    }

    async findByPhone(phone) {
        throw new Error('Method not implemented');
    }

    async findByRefreshToken(refreshToken) {
        throw new Error('Method not implemented');
    }

    async updateRefreshToken(userId, refreshToken) {
        throw new Error('Method not implemented');
    }

    async clearRefreshToken(userId) {
        throw new Error('Method not implemented');
    }

    async findByGoogleId(googleId) {
        throw new Error('Method not implemented');
    }
}
