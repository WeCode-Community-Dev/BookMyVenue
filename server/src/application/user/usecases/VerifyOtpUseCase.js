import { NotFoundError } from "../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import crypto from "crypto";
import HashService from "../../../infrastructure/services/HashService.js";

export default class VerifyOtpUseCase {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async execute(email, otpCode) {
        const user = await this._userRepository.findByEmail(email, false, true);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        if (user.isOtpVerified) {
            throw new UnauthorizedError("User is already OTP verified");
        }

        if (!user.otpCode || !user.otpExpiresAt) {
            throw new UnauthorizedError("OTP not generated or already used");
        }

        // Check if OTP has expired
        if (new Date() > new Date(user.otpExpiresAt)) {
            throw new UnauthorizedError("OTP code has expired");
        }

        // Use constant-time comparison to prevent timing attacks
        const isOtpValid = await HashService.compare(otpCode, user.otpCode);

        if (!isOtpValid) {
            throw new UnauthorizedError("Invalid OTP code");
        }

        const verifiedUser = await this._userRepository.verifyOtp(user.id);

        if (!verifiedUser) {
            throw new UnauthorizedError("Unable to verify OTP");
        }

        return verifiedUser;
    }
}

