export class IUserRepository {

    async findById(id) {
        throw new Error("Method not implemented");
    }

    async findAllFiltered(query = {}) {
        throw new Error("Method not implemented");
    }

    // Admin block/unblock user
    async updateBlockStatus(id, isBlocked) {
        throw new Error("Method not implemented");
    }

    async create(data) {
        throw new Error("Method not implemented");
    }

    async update(id, data) {
        throw new Error("Method not implemented");
    }

    async verifyOtp(userId) {
        throw new Error('Method not implemented');
    }

    async delete(id) {
        throw new Error("Method not implemented");
    }

    async softDelete(id) {
        throw new Error("Method not implemented");
    }

    // includeOtp needed for VerifyOtpUseCase
    async findByEmail(email, includePassword = false, includeOtp = false) {
        throw new Error('Method not implemented');
    }

    // async findByPhone(phone) {
    //     throw new Error("Method not implemented");
    // }

    async findByRefreshToken(refreshToken) {
        throw new Error('Method not implemented');
    }

    async updateRefreshToken(userId, refreshToken) {
        throw new Error("Method not implemented");
    }

    async clearRefreshToken(token) {
        throw new Error('Method not implemented');
    }

    async findByGoogleId(googleId) {
        throw new Error('Method not implemented');
    }

    // user profile
    async saveEmailChangeOtp(userId, pendingEmail, otpCode, otpExpiresAt) {
        throw new Error("Method not implemented");
    }

    async updateEmailAfterVerification(userId) {
        throw new Error("Method not implemented");
    }

    async findByIdWithOtp(userId) {
        throw new Error("Method not implemented");
    }

    async clearEmailChangeOtp(userId) {
        throw new Error("Method not implemented");
    }

    async addToWishlist(userId, venueId) {
        throw new Error("Method not implemented");
    }

    async getWishlist(userId) {
        throw new Error("Method not implemented");
    }

    async removeWishlist(userId, venueId) {
        throw new Error("Method not implemented");
    }

    async updateProfileImage(userId, profileImage) {
        throw new Error("Method not implemented");
    }

    async removeProfileImage(userId) {
        throw new Error("Method not implemented");
    }
}
