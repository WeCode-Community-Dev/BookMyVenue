import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../shared/constants/messages/authMessages.js";

export default class RefreshTokenUseCase {
    constructor(userRepository, tokenService) {
        this._userRepository = userRepository;
        this._tokenService = tokenService;
    }

    async execute(refreshToken) {
        if (!refreshToken) {
            throw new UnauthorizedError(authMessages.error.NO_REFRESH_TOKEN);
        }

        const decoded = this._tokenService.verifyRefreshToken(refreshToken);

        const user = await this._userRepository.findByRefreshToken(refreshToken);

        if (!user) {
            throw new UnauthorizedError(authMessages.error.REFRESH_TOKEN_REVOKED);
        }

        const payload = { userId: user.id, role: user.role };
        const newAccessToken = this._tokenService.generateAccessToken(payload);
        const newRefreshToken = this._tokenService.generateRefreshToken(payload);

        await this._userRepository.updateRefreshToken(user.id, newRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
