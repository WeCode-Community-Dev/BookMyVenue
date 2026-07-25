import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { AppError } from "../../../../domain/errors/app.error.js";
import { statusCode } from "../../../../shared/constants/enums/statusCode.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export default class UserResetPasswordUseCase {
    constructor(userRepository, hashService) {
        this._userRepository = userRepository;
        this._hashService = hashService;
    }

    async execute(token, password) {

        const user = await this._userRepository.findByResetToken(token);

        if (!user) {
            throw new NotFoundError(authMessages.error.USER_NOT_FOUND);
        }

        if (!user.resetToken || !user.resetTokenExpiry) {
            throw new UnauthorizedError(authMessages.error.NO_RESET_REQUEST);
        }

        const hashedIncomingToken = this._hashService.hashToken(token)
        if (user.resetToken !== hashedIncomingToken) {
            throw new UnauthorizedError(authMessages.error.INVALID_RESET_TOKEN);
        }

        if (user.resetTokenExpiry < new Date()) {
            throw new UnauthorizedError(authMessages.error.RESET_TOKEN_EXPIRED);
        }

        const hashedPassword = await this._hashService.hash(password);

        const updatedUser = await this._userRepository.update(user.id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        });

        if (!updatedUser) {
            throw new AppError(authMessages.error.RESET_PASSWORD_FAILED, statusCode.SERVER_ERROR);
        }

        return { 
            success: true
         };
    }
}
