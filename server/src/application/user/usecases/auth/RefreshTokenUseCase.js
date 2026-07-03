import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export default class RefreshTokenUseCase {
    constructor(userRepository, tokenService, hashService) {
        this._userRepository = userRepository;
        this._tokenService = tokenService;
        this._hashService = hashService
    }

    async execute(refreshToken) {
        if (!refreshToken) {
            throw new UnauthorizedError(authMessages.error.NO_REFRESH_TOKEN);
        }

        const {id, role} = this._tokenService.verifyRefreshToken(refreshToken);

        const user = await this._userRepository.findById(id);

        if (!user) {
            throw new UnauthorizedError(authMessages.error.REFRESH_TOKEN_REVOKED);
        }

        const payload = { userId: user.id, role: role };
        const newAccessToken = this._tokenService.generateAccessToken(payload);
        const newRefreshToken = this._tokenService.generateRefreshToken(payload);
        const hashedRefreshToken = await this._hashService.hashToken(newRefreshToken)
        await this._userRepository.updateRefreshToken(user.id, hashedRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
