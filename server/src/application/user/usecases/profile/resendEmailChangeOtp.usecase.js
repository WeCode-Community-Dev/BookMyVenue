import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";

export class ResendEmailChangeOtpUsecase {
    constructor(userRepository, hashService, otpService, mailService) {
        this._userRepository = userRepository;
        this._hashService = hashService;
        this._otpService = otpService;
        this._mailService = mailService;
    }

    async execute(userId){

        const user = await this._userRepository.findById(userId);

        if(!user){
            throw new NotFoundError(
            UserMessage.error.USER_NOT_FOUND
        );
        }

        if(!user.pendingEmail){
            throw new ValidationError(
            UserMessage.error.EMAIL_CHANGE_REQUEST_NOT_FOUND
        );
        }

        const otp = this._otpService.generateOtp();

        const otpExpiresAt = this._otpService.getOtpExpiry();

        const hashedOtp = await this._hashService.hash(otp);

       

        await this._userRepository.saveEmailChangeOtp(
            userId,
            user.pendingEmail,
            hashedOtp,
            otpExpiresAt
        );

        await this._mailService.resendEmailChangeOtp(
            user.pendingEmail,
            otp
        );

        return {
            message: UserMessage.success.OTP_RESENT
        };
    }
}