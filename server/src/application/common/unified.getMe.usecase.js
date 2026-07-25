import { NotFoundError } from "../../domain/errors/NotFoundError.js"
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError.js"
import { authMessages } from "../../shared/constants/messages/authMessages.js"

export class UnifiedGetMeUsecase  {
    constructor (
        tokenService,
        repositories
    ) {
        this._tokenService = tokenService
        this._repositories = repositories
    }

    async execute(refreshToken) {
        const { id, role } = await this._tokenService.verifyRefreshToken(refreshToken)

        if(!id || !role){
            throw new UnauthorizedError(authMessages.error.UNAUTHORIZED)
        }
        const repository = this._repositories[role]
        const user = await repository.findById(id)

        if(!user){
            throw new NotFoundError(authMessages.error.USER_NOT_FOUND)
        }

        const accessToken = this._tokenService.generateAccessToken( user.id, user.email, role);

        return  {
            accessToken,
            user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                profileImage: user.profileImage.url
            }
        }
    }
}