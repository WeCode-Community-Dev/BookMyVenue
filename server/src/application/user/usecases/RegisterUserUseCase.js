import { ConflictError } from "../../../domain/errors/ConflictError.js";
import { UserRole } from "../../../domain/enums/UserRole.enum.js";
import { UserEntity } from "../../../domain/entities/User.js";
import { sendMail } from "../../../infrastructure/services/MailService.js";
import { otpTemplate } from "../../../infrastructure/emailTemplates/otpTemplate.js";

class RegisterUserUseCase {
    constructor(userRepository, hashService) {
        this._userRepository = userRepository;
        this._hashService = hashService;
    }

    async execute(userData) {
        const existing = await this._userRepository.findByEmail(userData.email);

        if (existing) {
            throw new ConflictError("Email already exists");
        }

        const hashedPassword = await this._hashService.hash(userData.password);
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtpCode = await this._hashService.hash(otpCode);
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
