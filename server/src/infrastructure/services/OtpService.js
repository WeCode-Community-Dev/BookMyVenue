import { IOtpService } from "../../domain/interfaces/IOtpService.js";
import bcrypt from "bcryptjs";

class OtpService extends IOtpService {
    generate() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async hash(otp) {
        return await bcrypt.hash(otp, 10);
    }

    async compare(otp, hashedOtp) {
        return await bcrypt.compare(otp, hashedOtp);
    }

    getExpiry(minutes = 10) {
        return new Date(Date.now() + minutes * 60 * 1000);
    }
}

export default new OtpService();
