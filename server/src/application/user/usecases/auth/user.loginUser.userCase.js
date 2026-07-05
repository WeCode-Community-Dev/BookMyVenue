import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";
import { UserRole } from "../../../../domain/enums/UserRole.enum.js";

export default class LoginUserUseCase {
    constructor(userRepository, hashService, tokenService) {
        this._userRepository = userRepository;
        this._hashService = hashService;
        this._tokenService = tokenService;
    }

    async execute({email, password}) {
        const user = await this._userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError(authMessages.error.USER_NOT_FOUND);
        }

        console.log("user from login: ", user)
        const isMatch = await this._hashService.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedError(authMessages.error.INVALID_CREDENTIALS);
        }

        if (!user.isOtpVerified) {
            throw new UnauthorizedError(authMessages.error.OTP_VERIFICATION_REQUIRED);
        }

        const accessToken = this._tokenService.generateAccessToken({id: user.id, email: user.email, role: UserRole.CUSTOMER});
        const refreshToken = this._tokenService.generateRefreshToken({id: user.id, role: UserRole.CUSTOMER});
        const hashedToken = await this._hashService.hashToken(refreshToken)
        await this._userRepository.updateRefreshToken(user.id, hashedToken);

        return {
            accessToken,
            refreshToken,
            user
        };
    }
}
