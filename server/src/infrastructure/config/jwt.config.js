export const jwtConfig = {
    accessToken: {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: Number(process.env.ACCESS_TOKEN_TTL)
    },
    refreshToken: {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: Number(process.env.REFRESH_TOKEN_TTL)
    }
}