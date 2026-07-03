export class ITokenService {
    async generateAccessToken(id, email, role) {
        throw new Error("Method not implemented");
    }
    async generateRefreshToken(id, role){
        throw new Error("Method not implemented")
    }
    async verifyAccessToken(token){
        throw new Error("Method not implemented")
    }
    async verifyRefreshToken(token){
        throw new Error("Method not implemented")
    }
    async blackListToken(token, expiresInSeconds){
        throw new Error("Method not implemented")
    }
    async isTokenBlacklisted(token){
        throw new Error("Method not implemented")
    }
}