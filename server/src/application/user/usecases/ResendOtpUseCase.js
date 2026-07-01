import { NotFoundError } from "../../../domain/errors/NotFoundError.js";
import { sendMail } from "../../../infrastructure/services/MailService.js";
import { otpTemplate } from "../../../infrastructure/emailTemplates/otpTemplate.js";
import { authMessages } from "../../../shared/constants/messages/authMessages.js";

export default class ResendOtpUseCase {
    constructor(userRepository, otpService) {
        this._userRepository = userRepository;
        this._otpService = otpService;
    }

    async execute(email) {
        const user = await this._userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError(authMessages.error.USER_NOT_FOUND);
        }

        const otpCode = this._otpService.generate();
        const hashedOtpCode = await this._otpService.hash(otpCode);
        const otpExpiresAt = this._otpService.getExpiry(10);

        await this._userRepository.update(user.id, {
            otpCode: hashedOtpCode,
            otpExpiresAt
        });

        await sendMail(
            email,
            'Your New BookMyVenue OTP Code - Resent',
            otpTemplate(user.fullName, otpCode)
        );

        return { email };
    }
}
