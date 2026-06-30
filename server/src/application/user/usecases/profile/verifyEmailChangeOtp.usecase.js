import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";


export class VerifyEmailChangeOtpUsecase{
    constructor(
            userRepository,
            hashService
        ) {
            this._userRepository = userRepository;
            this._hashService = hashService;
        }
    async execute(userId,otp){
        const user=await this._userRepository.findByIdWithOtp(userId)

        if(!user){
            throw new NotFoundError(UserMessage.error.USER_NOT_FOUND)
        }
        if(!user.pendingEmail){
            throw new ValidationError(
            UserMessage.error.EMAIL_CHANGE_REQUEST_NOT_FOUND
        )
                }
        if(!user.otpCode){
           throw new ValidationError(
            UserMessage.error.OTP_NOT_FOUND
        )
        }

        if(new Date()>user.otpExpiresAt){
            throw new ValidationError(
            UserMessage.error.OTP_EXPIRED
        )
        }

        const isValid = await this._hashService.compare(otp, user.otpCode);

        if(!isValid){
            throw new ValidationError(
            UserMessage.error.INVALID_OTP
        )
        }

        const updatedUser=
        await this._userRepository.updateEmailAfterVerification(userId)
        
        return updatedUser
    }
}