import { NotFoundError } from "../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import { UserMapper } from "../../mapper/User.mapper.js";
import { authMessages } from "../../../shared/constants/messages/authMessages.js";

export default class LoginUserUseCase {
    constructor(userRepository, hashService, tokenService) {
        this._userRepository = userRepository;
        this._hashService = hashService;
        this._tokenService = tokenService;
    }

    async execute(email, password) {
        const user = await this._userRepository.findByEmail(email, true);

        if (!user) {
            throw new NotFoundError(authMessages.error.USER_NOT_FOUND);
        }

        const isMatch = await this._hashService.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedError(authMessages.error.INVALID_CREDENTIALS);
        }

        if (!user.isOtpVerified) {
            throw new UnauthorizedError(authMessages.error.OTP_VERIFICATION_REQUIRED);
        }

        if (!user.isOtpVerified) {
            throw new UnauthorizedError("OTP verification required");
        }

        if (!user.isOtpVerified) {
            throw new UnauthorizedError("OTP verification required");
        }

        const payload = { userId: user.id, role: user.role };
        const accessToken = this._tokenService.generateAccessToken(payload);
        const refreshToken = this._tokenService.generateRefreshToken(payload);

        await this._userRepository.updateRefreshToken(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
            user: UserMapper.toDTO(user)
        };
    }
}
