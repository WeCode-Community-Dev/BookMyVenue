import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export class VendorLogoutUseCase {
    constructor(
        vendorRepository,
        hashService,
        tokenService
    ) {
        this._vendorRepository = vendorRepository;
        this._hashService = hashService;
        this._tokenService = tokenService

    }

    async execute(refreshToken, accessToken) {
        if(accessToken){
            const expireInSeconds = process.env.ACCESS_TOKEN_MAX_AGE ? Math.floor(Number(process.env.ACCESS_TOKEN_MAX_AGE) / 1000 ): 3600
            await this._tokenService.blackListToken(accessToken, expireInSeconds)
        }
        if (!refreshToken) {
            throw new UnauthorizedError(authMessages.error.NO_REFRESH_TOKEN);
        }

        const payload = this._tokenService.verifyRefreshToken(refreshToken)

        if(!payload){
            throw new UnauthorizedError(authMessages.error.UNAUTHORIZED)
        }

        const vendor = await this._vendorRepository.findById(payload.id);

        if (!vendor) {
            throw new UnauthorizedError(authMessages.error.INVALID_REFRESH_TOKEN);
        }

        const hashedRefreshToken = await this._hashService.hashToken(refreshToken)
        await this._vendorRepository.clearRefreshToken(hashedRefreshToken);
    }
}
