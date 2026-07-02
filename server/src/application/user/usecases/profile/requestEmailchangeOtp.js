import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ConflictError } from "../../../../domain/errors/ConflictError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { UserMessage } from "../../../../shared/constants/messages/userMessages.js";


export class RequestEmailChangeOtpUsecase{
    constructor(
        userRepository,
        hashService,
        otpService,
        mailService
    ) {
        this._userRepository = userRepository;
        this._hashService = hashService;
        this._otpService = otpService;
        this._mailService = mailService;
    }
    async execute(userId,newEmail){
        const user=await this._userRepository.findById(userId)
        if(!user){
            throw new NotFoundError(
            UserMessage.error.USER_NOT_FOUND
        )
        }
        if(user.isBlocked){
            throw new ValidationError(
            UserMessage.error.USER_BLOCKED_EMAIL_CHANGE
        )
        }
        if(user.email===newEmail){
            throw new ValidationError(
            UserMessage.error.EMAIL_SAME_AS_CURRENT
        )
        }

        const existingUser=
        await this._userRepository.findByEmail(newEmail)
        if(existingUser){
            throw new ConflictError(
            UserMessage.error.EMAIL_ALREADY_EXISTS
        )
        }

        const otp = this._otpService.generateOtp();

        const otpExpiresAt = this._otpService.getOtpExpiry();
        console.log("OTP => ", otp)
        const hashedOtp = await this._hashService.hash(otp);

        await this._userRepository.saveEmailChangeOtp(
            userId,
            newEmail,
            hashedOtp,
            otpExpiresAt
        )

        await this._mailService.sendEmailChangeOtp(
            newEmail,
            otp
        );
        return{
           message: UserMessage.success.OTP_SENT
        }

    }
}