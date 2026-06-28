import { NotFoundError } from "../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import TokenService from "../../../infrastructure/services/TokenService.js";

export default class LoginUserUseCase {
    constructor(userRepository, hashService) {
        this._userRepository = userRepository;
        this._hashService = hashService;
    }

    async execute(email, password) {
        const user = await this._userRepository.findByEmail(email, true);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const isMatch = await this._hashService.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedError("Invalid credentials");
        }

        if (!user.isOtpVerified) {
            throw new UnauthorizedError("OTP verification required");
        }

        const payload = { userId: user.id, role: user.role };
        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        await this._userRepository.updateRefreshToken(user.id, refreshToken);

        const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;

        return {
            accessToken,
            refreshToken,
            user: userWithoutSensitiveData
        };
    }
}
