import { generateOtp } from "../../shared/utils/genarateotp.js";
import IOtpService from "../../domain/interfaces/IOtpService.js";

class OtpService extends IOtpService {

    generateOtp() {
        return generateOtp();
    }

    getOtpExpiry() {
        return new Date(Date.now() + 5 * 60 * 1000);
    }

}

export default new OtpService();