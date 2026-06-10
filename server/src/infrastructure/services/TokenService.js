import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError.js";

class TokenService {
    generateAccessToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m"
        });
    }

    generateRefreshToken(payload) {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
        });
    }

    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch {
            throw new UnauthorizedError("Invalid or expired refresh token");
        }
    }

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            throw new UnauthorizedError("Invalid or expired access token");
        }
    }
}

export default new TokenService();
