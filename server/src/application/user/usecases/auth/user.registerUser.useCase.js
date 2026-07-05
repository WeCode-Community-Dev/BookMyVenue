import { ConflictError } from "../../../../domain/errors/ConflictError.js";
import { UserRole } from "../../../../domain/enums/UserRole.enum.js";
import { UserEntity } from "../../../../domain/entities/User.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";



export class RegisterUserUseCase {
    constructor(
        userRepository, 
        hashService, 
        otpService, 
        otpStoreService,
        mailService
    ) {
        this._userRepository = userRepository;
        this._hashService = hashService;
        this._otpService = otpService;
        this._otpStoreService = otpStoreService;
        this._mailService = mailService
    }

    async execute({
        fullName,
        email, 
        phone,
        password
    }) {
        const existing = await this._userRepository.findByEmail(email);
        console.log('existing user: ', existing)
        if (existing) {
            throw new ConflictError(authMessages.error.EMAIL_ALREADY_EXISTS);
        }

        const hashedPassword = await this._hashService.hash(password);
        const user = new UserEntity({
            fullName: fullName,
            email: email,
            phone: phone,
            password: hashedPassword,
            role: UserRole.CUSTOMER,
        });

        const savedUser = await this._userRepository.create(user)
        
        const otp = this._otpService.generate();
        console.log('otp is:', otp)
        const hashedOtp = await this._otpService.hash(otp);
        await this._otpStoreService.saveOtp(savedUser.id, hashedOtp, 120)

        await this._mailService.sendVerifiyRegisterOtp(savedUser.email, savedUser.fullName, otp)

        return {
            success: true
        }
    }
}
