import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export default class ForgotPasswordUseCase {
    constructor(userRepository, tokenService, mailService) {
        this._userRepository = userRepository;
        this._tokenService = tokenService;
        this._mailService = mailService;
    }

    async execute(email) {
        const user = await this._userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError(authMessages.error.USER_NOT_FOUND_WITH_EMAIL);
        }

        const resetToken = this._tokenService.generateResetToken();
        const resetTokenExpiry = this._tokenService.getResetTokenExpiry();

        await this._userRepository.update(user.id, {
            resetToken,
            resetTokenExpiry
        });

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${email}`;

        await this._mailService.sendForgotPasswordMail(user, resetLink);

        return { email };
    }
}
