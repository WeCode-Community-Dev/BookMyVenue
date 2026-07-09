import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { AppError } from "../../../../domain/errors/app.error.js";
import { statusCode } from "../../../../shared/constants/enums/statusCode.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export class VendorResetPasswordUseCase {
    constructor(vendorRepository, hashService) {
        this._vendorRepository = vendorRepository;
        this._hashService = hashService;
    }

    async execute(email, resetToken, newPassword) {
        console.log("email, password: ", email)
        const vendor = await this._vendorRepository.findByEmail(email);

        if (!vendor) {
            throw new NotFoundError(authMessages.error.VENDOR_NOT_FOUND);
        }

        if (!vendor.resetToken || !vendor.resetTokenExpiry) {
            throw new UnauthorizedError(authMessages.error.NO_RESET_REQUEST);
        }

        const hashedIncomingToken = this._hashService.hashToken(resetToken)
        if (vendor.resetToken !== hashedIncomingToken) {
            throw new UnauthorizedError(authMessages.error.INVALID_RESET_TOKEN);
        }

        if (vendor.resetTokenExpiry < new Date()) {
            throw new UnauthorizedError(authMessages.error.RESET_TOKEN_EXPIRED);
        }

        const hashedPassword = await this._hashService.hash(newPassword);

        const updatedVendor = await this._vendorRepository.update(vendor.id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        });

        if (!updatedVendor) {
            throw new AppError(authMessages.error.RESET_PASSWORD_FAILED, statusCode.SERVER_ERROR);
        }

        return { 
            success: true
         };
    }
}
