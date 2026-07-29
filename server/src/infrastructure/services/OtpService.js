import { IOtpService } from '../../application/services/otpService.js'
import bcrypt from "bcryptjs";

export class OtpService extends IOtpService {
    generate() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async hash(otp) {
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)
        return await bcrypt.hash(otp, saltRounds);
    }

    async compare(otp, hashedOtp) {
        return await bcrypt.compare(otp, hashedOtp);
    }

    getExpiry(minutes = 10) {
        return new Date(Date.now() + minutes * 60 * 1000);
    }
}
