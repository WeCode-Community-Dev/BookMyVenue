import { NotFoundError } from "../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import { UserMapper } from "../../mapper/User.mapper.js";
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

        const payload = { userId: user.id, role: user.role };
        const accessToken = TokenService.generateAccessToken(payload);
        const refreshToken = TokenService.generateRefreshToken(payload);

        await this._userRepository.saveRefreshToken(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
            user: UserMapper.toDTO(user)
        };
    }
}
