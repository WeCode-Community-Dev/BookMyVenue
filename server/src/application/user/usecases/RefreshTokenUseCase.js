import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";

export default class RefreshTokenUseCase {
    execute(refreshToken) {
        if (!refreshToken) {
            throw new UnauthorizedError("No refresh token provided");
        }

        // Token verification is delegated to TokenService in the controller layer
        return refreshToken;
    }
}
