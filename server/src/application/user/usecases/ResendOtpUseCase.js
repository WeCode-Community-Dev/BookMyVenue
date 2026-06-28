import { NotFoundError } from "../../../domain/errors/NotFoundError.js";
import { sendMail } from "../../../infrastructure/services/MailService.js";
import { otpTemplate } from "../../../infrastructure/emailTemplates/otpTemplate.js";

export default class ResendOtpUseCase {
    constructor(userRepository, hashService) {
        this._userRepository = userRepository;
        this._hashService = hashService;
    }

    async execute(email) {
        const user = await this._userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtpCode = await this._hashService.hash(otpCode);
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await this._userRepository.update(user.id, {
            otpCode: hashedOtpCode,
            otpExpiresAt
        });

        await sendMail(
            email,
            'Your New BookMyVenue OTP Code - Resent',
            otpTemplate(user.fullName, otpCode)
        );

        return {
            email,
            message: "New OTP sent successfully. Check your email."
        };
    }
}
