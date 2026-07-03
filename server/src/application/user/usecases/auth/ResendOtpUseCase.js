import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";

export default class ResendOtpUseCase {
    constructor(
        userRepository, 
        otpService,
        otpStoreService,
        mailService
    ) {
        this._userRepository = userRepository;
        this._otpService = otpService;
        this._otpStoreService = otpStoreService;
        this._mailService = mailService
    }

    async execute({email}) {
        const user = await this._userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError(authMessages.error.USER_NOT_FOUND);
        }

        const otp = this._otpService.generate();
        console.log('otp is:', otp)
        const hashedOtp = await this._otpService.hash(otp);
        await this._otpStoreService.saveOtp(user.id, hashedOtp, 120)
        await this._mailService.sendVerifiyRegisterOtp(user.email, user.fullName, otp)

        return { 
            success: true
        };
    }
}
