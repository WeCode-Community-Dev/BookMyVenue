import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";
import { UserRole } from "../../../../domain/enums/UserRole.enum.js";

export class LoginVendorUsecase {
    constructor(
        vendorRepository, 
        hashService,
        tokenService
    ) {
        this._vendorRepository = vendorRepository;
        this._hashService = hashService;
        this._tokenService = tokenService;
    }

    async execute({email, password}) {
        const vendor = await this._vendorRepository.findByEmail(email);

        if (!vendor) {
            throw new UnauthorizedError(authMessages.error.OWNER_NOT_FOUND);
        }

        const isMatch = await this._hashService.compare(password, vendor.password);
        if (!isMatch) {
            throw new UnauthorizedError(authMessages.error.INVALID_CREDENTIALS);
        }
        console.log("login user: ", vendor)

        if(!vendor.isVerified){
            throw new UnauthorizedError(authMessages.error.OTP_VERIFICATION_REQUIRED)
        }

        const accessToken = this._tokenService.generateAccessToken( vendor.id, vendor.email, UserRole.VENDOR );
        const refreshToken = this._tokenService.generateRefreshToken(vendor.id, UserRole.VENDOR)
        const hashedToken = await this._hashService.hashToken(refreshToken)
        await this._vendorRepository.updateRefreshToken(vendor.id, hashedToken)

        return { 
            accessToken, 
            refreshToken,
            vendor:{
                id: vendor.id,
                name: vendor.fullName,
                email: vendor.email,
                role: vendor.role,
                isVerified: vendor.isVerified,
                profileImage: vendor.profileImage.url,
                approvalStatus: vendor.approvalStatus
            }
        };
    }
}

