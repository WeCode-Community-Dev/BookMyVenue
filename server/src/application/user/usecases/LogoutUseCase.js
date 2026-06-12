import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";

export default class LogoutUseCase {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async execute(refreshToken) {
        if (!refreshToken) {
            throw new UnauthorizedError("No refresh token provided");
        }

        const user = await this._userRepository.findByRefreshToken(refreshToken);

        if (!user) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        await this._userRepository.clearRefreshToken(user.id);
    }
}
