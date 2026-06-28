import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import HashService from "../../../../infrastructure/services/HashService.js";

export class VerifyEmailChangeOtpUsecase{
    constructor(userRepository){
        this._userRepository=userRepository
    }
    async execute(userId,otp){
        const user=await this._userRepository.findByIdWithOtp(userId)

        if(!user){
            throw new NotFoundError("User not found")
        }
        if(!user.pendingEmail){
            throw new ValidationError("no email chnage request found")
        }
        if(!user.otpCode){
            throw new ValidationError("OTP not found")
        }

        if(new Date()>user.otpExpiresAt){
            throw new ValidationError("OTP has expired")
        }

        const isValid=await HashService.compare(otp,user.otpCode)

        if(!isValid){
            throw new ValidationError("Invalid OTP")
        }

        const updatedUser=
        await this._userRepository.updateEmailAfterVerification(userId)
        
        return updatedUser
    }
}