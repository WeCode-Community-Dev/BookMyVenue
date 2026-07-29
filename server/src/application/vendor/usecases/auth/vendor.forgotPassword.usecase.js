import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export default class VendorForgotPasswordUseCase {
    constructor(
        vendorRepository, 
        tokenService, 
        mailService,
        hashService
    ) {
        this._vendorRepository = vendorRepository;
        this._tokenService = tokenService;
        this._mailService = mailService;
        this._hashService = hashService;
    }

    async execute({email}) {
        const vendor = await this._vendorRepository.findByEmail(email);

        if (!vendor) {
            throw new NotFoundError(authMessages.error.VENDOR_NOT_FOUND);
        }

        const resetToken = this._tokenService.generateResetToken();
        const resetTokenExpiry = this._tokenService.getResetTokenExpiry();

        const hashedResetToken = this._hashService.hashToken(resetToken)
        vendor.resetToken = hashedResetToken
        vendor.resetTokenExpiry = resetTokenExpiry
        const updated = await this._vendorRepository.update(vendor.id, vendor);
        
        console.log('updated user', updated)
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?role=${updated.role}&token=${resetToken}`;
        console.log("link", resetLink)
        // await this._mailService.sendForgotPasswordMail(vendor, resetLink);

        return { 
            success: true
        };
    }
}
