import { UnauthorizedError } from "../../../../domain/errors/UnauthorizedError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

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

        const payload = { id: vendor.id, role: vendor.role }
        const accessToken = this._tokenService.generateAccessToken( payload );
        const refreshToken = this._tokenService.generateRefreshToken(payload)
        const hashedToken = await this._hashService.hashToken(refreshToken)
        await this._vendorRepository.updateRefreshToken(vendor.id, hashedToken)

        return { 
            accessToken, 
            refreshToken,
            user:{
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

