export const jwtConfig = {
    accessToken: {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_TTL
    },
    refreshToken: {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_TTL
    }
}