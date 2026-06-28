import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import HashService from "../../../../infrastructure/services/HashService.js";
import { generateOtp } from "../../../../shared/utils/genarateotp.js";
import { sendMail } from "../../../../infrastructure/services/MailService.js";
import { ConflictError } from "../../../../domain/errors/ConflictError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";


export class RequestEmailChangeOtpUsecase{
    constructor(userRepository){
        this._userRepository=userRepository
    }
    async execute(userId,newEmail){
        const user=await this._userRepository.findById(userId)
        if(!user){
            throw new NotFoundError("user not found")
        }
        if(user.isBlocked){
            throw new ValidationError("Blocked users canot chnage email")
        }
        if(user.email===newEmail){
            throw new ValidationError("New email cannot be same as current email")
        }

        const existingUser=
        await this._userRepository.findByEmail(newEmail)
        if(existingUser){
            throw new ConflictError("Email ALready exists")
        }

        const otp=generateOtp()
        console.log("OTP => ", otp)
        const hashedOtp=await HashService.hash(otp)

        const otpExpiresAt=new Date(Date.now()+5*60*1000)

        await this._userRepository.saveEmailChangeOtp(
            userId,
            newEmail,
            hashedOtp,
            otpExpiresAt
        )

        await sendMail(
            newEmail,
            "Emailchnage OTP",
            `
            <h2>Email Change Verification</h2>
            <p>your OTP is:</p>
            <h1>${otp}</h1>
            <p>THis OTP is valid for 5 minutes </p>
            `
        );
        return{
            message:"OTP sent successfully"
        }

    }
}