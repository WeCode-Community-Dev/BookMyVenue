import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../shared/constants/messages/authMessages.js";

export default class LogoutUseCase {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async execute(refreshToken) {
        if (!refreshToken) {
            throw new UnauthorizedError(authMessages.error.NO_REFRESH_TOKEN);
        }

        const user = await this._userRepository.findByRefreshToken(refreshToken);

        if (!user) {
            throw new UnauthorizedError(authMessages.error.INVALID_REFRESH_TOKEN);
        }

        await this._userRepository.clearRefreshToken(user.id);
    }
}
