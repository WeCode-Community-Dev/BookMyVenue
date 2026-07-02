
import IOtpService from "../../domain/interfaces/IOtpService.js";

class OtpService extends IOtpService {

    generateOtp() {
        return Math.floor(
            100000 + Math.random() * 900000
        ).toString();
    }

    getOtpExpiry() {
        return new Date(Date.now() + 5 * 60 * 1000);
    }

}

export default new OtpService();