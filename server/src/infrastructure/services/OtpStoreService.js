import { IOtpStoreService } from '../../application/services/otpStoreService.js'


export class OtpStoreService extends IOtpStoreService {

    constructor( redis ) {
        super()
        this._redis = redis
    }

    async saveOtp(userId, otp, ttlSeconds) {
        await this._redis.set(userId, otp, "EX", ttlSeconds)
    }

    async getOtp(userId) {
        return await this._redis.get(userId)
    }

    async deleteOtp(userId) {
        await this._redis.del(userId)
    }
}