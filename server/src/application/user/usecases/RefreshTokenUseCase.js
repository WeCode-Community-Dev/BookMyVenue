import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import TokenService from "../../../infrastructure/services/TokenService.js";

export default class RefreshTokenUseCase {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async execute(refreshToken) {
        if (!refreshToken) {
            throw new UnauthorizedError("No refresh token provided");
        }

        const decoded = TokenService.verifyRefreshToken(refreshToken);

        const user = await this._userRepository.findByRefreshToken(refreshToken);

        if (!user) {
            throw new UnauthorizedError("Refresh token is invalid or has been revoked");
        }

        const payload = { userId: user.id, role: user.role };
        const newAccessToken = TokenService.generateAccessToken(payload);
        const newRefreshToken = TokenService.generateRefreshToken(payload);

        await this._userRepository.updateRefreshToken(user.id, newRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
