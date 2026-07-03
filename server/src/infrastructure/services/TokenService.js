import jwt from "jsonwebtoken";
import crypto from "crypto";
import { jwtConfig } from '../config/jwt.config.js'
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError.js";
import { ITokenService } from "../../application/services/tokenService.js";
import { authMessages } from "../../shared/constants/messages/authMessages.js";
import { redisClient } from '../config/redis.config.js'

export class TokenService extends ITokenService{
    generateAccessToken(id, email, role) {
        const accessTokenSecret = jwtConfig.accessToken.secret
        return jwt.sign({id, email, role}, accessTokenSecret, { expiresIn: jwtConfig.accessToken.expiresIn });
    }

    generateRefreshToken(payload) {
        const refreshTokenSecret = jwtConfig.refreshToken.secret
        return jwt.sign(payload, refreshTokenSecret, { expiresIn: jwtConfig.refreshToken.expiresIn });
    }

    generateResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    getResetTokenExpiry() {
        return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    }

    verifyRefreshToken(token) {
        try {
            const accessTokenSecret = jwtConfig.accessToken.secret
            return jwt.verify(token, accessTokenSecret);
        } catch {
            throw new UnauthorizedError(authMessages.error.INVALID_REFRESH_TOKEN);
        }
    }

    verifyAccessToken(token) {
        try {
            const refreshTokenSecret = jwtConfig.refreshToken.secret
            return jwt.verify(token, refreshTokenSecret);
        } catch {
            throw new UnauthorizedError(authMessages.error.INVALID_ACCESS_TOKEN);
        }
    }

    async blackListToken(token, expiresInSeconds) {
        await redisClient.set(`bl_${token}`, "true", "EX",  expiresInSeconds)
    }

    async isTokenBlacklisted(token) {
        const result = await redisClient.exists(`bl_${token}`)
        return result === 1
    }
}

