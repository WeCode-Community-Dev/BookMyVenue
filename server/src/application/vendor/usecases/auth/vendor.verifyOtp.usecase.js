import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export class VendorVerifyOtpUseCase {
    constructor(
        vendorRepository, 
        otpService,
        otpStoreService
    ) {
        this._vendorRepository = vendorRepository;
        this._otpService = otpService;
        this._otpStoeService = otpStoreService
    }

    async execute({email, otpCode}) {
        const vendor = await this._vendorRepository.findByEmail(email);

        if (!vendor) {
            throw new NotFoundError(authMessages.error.VENDOR_NOT_FOUND);
        }

        if (vendor.isOtpVerified) {
            throw new UnauthorizedError(authMessages.error.ALREADY_OTP_VERIFIED);
        }

        const storedOtp = await this._otpStoeService.getOtp(vendor.id)
        if(!storedOtp){
            throw new NotFoundError(authMessages.error.OTP_EXPIRED)
        }

        const isOtpValid = await this._otpService.compare(otpCode, storedOtp);

        if (!isOtpValid) {
            throw new UnauthorizedError(authMessages.error.INVALID_OTP);
        }

        const verifiedVendor = await this._vendorRepository.verifyOtp(vendor.id);

        if (!verifiedVendor) {
            throw new UnauthorizedError(authMessages.error.OTP_VERIFY_FAILED);
        }

        return {
            success: true
        }
    }
}
