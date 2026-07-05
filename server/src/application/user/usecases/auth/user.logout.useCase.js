import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export default class UserLogoutUseCase {
    constructor(
        userRepository,
        hashService,
        tokenService
    ) {
        this._userRepository = userRepository;
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

        const { id, role } = this._tokenService.verifyRefreshToken(refreshToken)
        if(!id || !role){
            throw new UnauthorizedError(authMessages.error.UNAUTHORIZED)
        }

        const user = await this._userRepository.findById(id);

        if (!user) {
            throw new UnauthorizedError(authMessages.error.INVALID_REFRESH_TOKEN);
        }

        const hashedRefreshToken = await this._hashService.hashToken(refreshToken)
        await this._userRepository.clearRefreshToken(hashedRefreshToken);
    }
}
