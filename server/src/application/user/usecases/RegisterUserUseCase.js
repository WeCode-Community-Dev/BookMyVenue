import { ConflictError } from "../../../domain/errors/ConflictError.js";
import { UserRole } from "../../../domain/enums/UserRole.enum.js";
import { UserEntity } from "../../../domain/entities/User.js";
import { sendMail } from "../../../infrastructure/services/MailService.js";
import { otpTemplate } from "../../../infrastructure/emailTemplates/otpTemplate.js";

import { authMessages } from "../../../shared/constants/messages/authMessages.js";



class RegisterUserUseCase {
    constructor(userRepository, hashService, otpService) {
        this._userRepository = userRepository;
        this._hashService = hashService;
        this._otpService = otpService;
    }

    async execute(userData) {
        const existing = await this._userRepository.findByEmail(userData.email);

        if (existing) {
            throw new ConflictError(authMessages.error.EMAIL_ALREADY_EXISTS);
        }

        const hashedPassword = await this._hashService.hash(userData.password);
        const otpCode = this._otpService.generate();
        const hashedOtpCode = await this._otpService.hash(otpCode);
        const otpExpiresAt = this._otpService.getExpiry(10);

        const userEntity = new UserEntity({
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            password: hashedPassword,
            role: UserRole.CUSTOMER,
            isOtpVerified: false,
            otpCode: hashedOtpCode,
            otpExpiresAt
        });

        const created = await this._userRepository.create(userEntity);

        await sendMail(
            created.email,
            'Your BookMyVenue OTP Code - Verify Your Email',
            otpTemplate(created.fullName, otpCode)
        );

        return created;
    }
}

export default RegisterUserUseCase;
