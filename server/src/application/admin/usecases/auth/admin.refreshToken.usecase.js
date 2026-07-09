import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export class AdminRefreshTokenUseCase {
    constructor(adminRepository, tokenService, hashService) {
        this._adminRepository = adminRepository;
        this._tokenService = tokenService;
        this._hashService = hashService
    }

    async execute(refreshToken) {
        if (!refreshToken) {
            throw new UnauthorizedError(authMessages.error.NO_REFRESH_TOKEN);
        }

        const {id, role} = this._tokenService.verifyRefreshToken(refreshToken);

        const admin = await this._adminRepository.findById(id);

        if (!admin) {
            throw new UnauthorizedError(authMessages.error.REFRESH_TOKEN_REVOKED);
        }

        const payload = { adminId: admin.id, role: role };
        const newAccessToken = this._tokenService.generateAccessToken(payload);
        const newRefreshToken = this._tokenService.generateRefreshToken(payload);
        const hashedRefreshToken = await this._hashService.hashToken(newRefreshToken)
        await this._adminRepository.updateRefreshToken(admin.id, hashedRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
