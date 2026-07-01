import { NotFoundError } from "../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../shared/constants/messages/authMessages.js";

export default class VerifyOtpUseCase {
    constructor(userRepository, otpService) {
        this._userRepository = userRepository;
        this._otpService = otpService;
    }

    async execute(email, otpCode) {
        const user = await this._userRepository.findByEmail(email, false, true);

        if (!user) {
            throw new NotFoundError(authMessages.error.USER_NOT_FOUND);
        }

        if (user.isOtpVerified) {
            throw new UnauthorizedError(authMessages.error.ALREADY_OTP_VERIFIED);
        }

        if (!user.otpCode || !user.otpExpiresAt) {
            throw new UnauthorizedError(authMessages.error.OTP_NOT_GENERATED);
        }

        if (new Date() > new Date(user.otpExpiresAt)) {
            throw new UnauthorizedError(authMessages.error.OTP_EXPIRED);
        }

        const isOtpValid = await this._otpService.compare(otpCode, user.otpCode);

        if (!isOtpValid) {
            throw new UnauthorizedError(authMessages.error.INVALID_OTP);
        }

        const verifiedUser = await this._userRepository.verifyOtp(user.id);

        if (!verifiedUser) {
            throw new UnauthorizedError(authMessages.error.OTP_VERIFY_FAILED);
        }

        return verifiedUser;
    }
}
