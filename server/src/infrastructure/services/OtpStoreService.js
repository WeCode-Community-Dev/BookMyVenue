import { IOtpStoreService } from '../../application/services/otpStoreService.js'


export class OtpStoreService extends IOtpStoreService {

    constructor( redis ) {
        super()
        this._redis = redis
    }

    async saveOtp(userId, otp, ttiSeconds) {
        await this._redis.set(userId, otp, "EX", ttiSeconds)
    }

    async getOtp(userId) {
        return this._redis.get(userId)
    }

    async deleteOtp(userId) {
        await this._redis.del(userId)
    }
}