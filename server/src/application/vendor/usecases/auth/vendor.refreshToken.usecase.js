import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export class VendorRefreshTokenUseCase {
    constructor(vendorRepository, tokenService, hashService) {
        this._vendorRepository = vendorRepository;
        this._tokenService = tokenService;
        this._hashService = hashService
    }

    async execute(refreshToken) {
        if (!refreshToken) {
            throw new UnauthorizedError(authMessages.error.NO_REFRESH_TOKEN);
        }

        const {id, role} = this._tokenService.verifyRefreshToken(refreshToken);

        const vendor = await this._vendorRepository.findById(id);

        if (!vendor) {
            throw new UnauthorizedError(authMessages.error.REFRESH_TOKEN_REVOKED);
        }

        const payload = { vendorId: vendor.id, role: role };
        const newAccessToken = this._tokenService.generateAccessToken(payload);
        const newRefreshToken = this._tokenService.generateRefreshToken(payload);
        const hashedRefreshToken = await this._hashService.hashToken(newRefreshToken)
        await this._vendorRepository.updateRefreshToken(vendor.id, hashedRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken, vendor };
    }
}
