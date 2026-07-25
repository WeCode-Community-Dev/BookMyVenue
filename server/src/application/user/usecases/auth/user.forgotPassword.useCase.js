import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export default class UserForgotPasswordUseCase {
    constructor(
        userRepository, 
        tokenService, 
        mailService,
        hashService
    ) {
        this._userRepository = userRepository;
        this._tokenService = tokenService;
        this._mailService = mailService;
        this._hashService = hashService;
    }

    async execute({email}) {
        const user = await this._userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError(authMessages.error.USER_NOT_FOUND_WITH_EMAIL);
        }

        const resetToken = this._tokenService.generateResetToken();
        const resetTokenExpiry = this._tokenService.getResetTokenExpiry();

        const hashedResetToken = this._hashService.hashToken(resetToken)
        user.resetToken = hashedResetToken
        user.resetTokenExpiry = resetTokenExpiry
        const updated = await this._userRepository.update(user.id, user);
        
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?role=${updated.role}&token=${resetToken}`;
        console.log("link", resetLink)
        await this._mailService.sendForgotPasswordMail(user, resetLink);

        return { 
            success: true
        };
    }
}
