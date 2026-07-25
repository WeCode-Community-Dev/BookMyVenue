import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export default class VendorrResendOtpUseCase {
    constructor(
        vendorRepository, 
        otpService,
        otpStoreService,
        mailService
    ) {
        this._vendorRepository = vendorRepository;
        this._otpService = otpService;
        this._otpStoreService = otpStoreService;
        this._mailService = mailService
    }

    async execute({email}) {
        const vendor = await this._vendorRepository.findByEmail(email);

        if (!vendor) {
            throw new NotFoundError(authMessages.error.VENDOR_NOT_FOUND);
        }

        const otp = this._otpService.generate();
        console.log('otp is:', otp)
        const hashedOtp = await this._otpService.hash(otp);
        await this._otpStoreService.saveOtp(vendor.id, hashedOtp, 120)
        await this._mailService.sendVerifiyRegisterOtp(vendor.email, vendor.fullName, otp)

        return { 
            success: true
        };
    }
}
