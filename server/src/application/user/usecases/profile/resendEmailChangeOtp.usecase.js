import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import HashService from "../../../../infrastructure/services/HashService.js";
import { generateOtp } from "../../../../shared/utils/genarateotp.js";
import { sendMail } from "../../../../infrastructure/services/MailService.js";

export class ResendEmailChangeOtpUsecase {
    constructor(userRepository){
        this._userRepository = userRepository;
    }

    async execute(userId){

        const user = await this._userRepository.findById(userId);

        if(!user){
            throw new NotFoundError("User not found");
        }

        if(!user.pendingEmail){
            throw new ValidationError("No email change request found");
        }

        const otp = generateOtp();

        const hashedOtp = await HashService.hash(otp);

        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await this._userRepository.saveEmailChangeOtp(
            userId,
            user.pendingEmail,
            hashedOtp,
            otpExpiresAt
        );

        await sendMail(
            user.pendingEmail,
            "Email Change OTP",
            `
            <h2>Email Change Verification</h2>
            <p>Your new OTP is:</p>
            <h1>${otp}</h1>
            <p>This OTP is valid for 5 minutes.</p>
            `
        );

        return {
            message:"OTP resent successfully"
        };
    }
}