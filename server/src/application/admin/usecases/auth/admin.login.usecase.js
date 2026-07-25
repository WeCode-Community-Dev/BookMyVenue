import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";
import { UserRole } from "../../../../domain/enums/UserRole.enum.js";

export class LoginAdminUsecase {
    constructor(
        adminRepository, 
        hashService,
        tokenService
    ) {
        this._adminRepository = adminRepository;
        this._hashService = hashService;
        this._tokenService = tokenService;
    }

    async execute({email, password}) {
        const admin = await this._adminRepository.findByEmail(email);

        if (!admin) {
            throw new UnauthorizedError(authMessages.error.ADMIN_NOT_FOUND);
        }

        const isMatch = await this._hashService.compare(password, admin.password);
        if (!isMatch) {
            throw new UnauthorizedError(authMessages.error.INVALID_CREDENTIALS);
        }

        const accessToken = this._tokenService.generateAccessToken(admin.id, admin.email, UserRole.ADMIN );
        const refreshToken = this._tokenService.generateRefreshToken( admin.id, UserRole.ADMIN)
        const hashedToken = await this._hashService.hashToken(refreshToken)
        await this._adminRepository.updateRefreshToken(admin.id, hashedToken)

        return { 
            accessToken, 
            refreshToken,
            admin: {
                id: admin.id,
                role: admin.role,
                email: admin.email,
                
            }
        };
    }
}

