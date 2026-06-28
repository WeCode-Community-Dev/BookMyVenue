import { NotFoundError } from "../../../domain/errors/NotFoundError.js";
import { sendMail } from "../../../infrastructure/services/MailService.js";
import { forgotPasswordTemplate } from "../../../infrastructure/emailTemplates/forgotPasswordTemplate.js";
import crypto from "crypto";

export default class ForgotPasswordUseCase {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async execute(email) {
        const user = await this._userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError("User not found with this email");
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await this._userRepository.update(user.id, {
            resetToken,
            resetTokenExpiry
        });

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${email}`;

        await sendMail(
            email,
            'Reset Your BookMyVenue Password',
            forgotPasswordTemplate(user.fullName, resetLink)
        );

        return {
            email,
            message: "Password reset link sent to your email. Check your inbox."
        };
    }
}
