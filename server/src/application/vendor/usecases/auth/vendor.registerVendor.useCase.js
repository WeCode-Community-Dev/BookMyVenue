import { ConflictError } from "../../../../domain/errors/ConflictError.js";
import { VendorEntity } from "../../../../domain/entities/Vendor.js";
import { authMessages } from "../../../../shared/constants/messages/authMessages.js";
import { UserRole } from "../../../../domain/enums/UserRole.enum.js";

export class RegisterVendorUsecase {
    constructor(
        vendorRepository, 
        hashService,
        otpService,
        otpStoreService,
        mailService
    ) {
        this._vendorRepository = vendorRepository;
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
        const existing = await this._vendorRepository.findByEmail(email);

        if (existing) {
            throw new ConflictError(authMessages.error.EMAIL_ALREADY_EXISTS);
        }

        const hashedPassword = await this._hashService.hash(password);

        const vendor = new VendorEntity({
            fullName: fullName,
            email: email,
            phone: phone,
            password: hashedPassword,
            role: UserRole.VENDOR
        });

        const savedVendor = await this._vendorRepository.create(vendor);
        const otp = this._otpService.generate()
        console.log('vendor otp is:', otp)

        const hashedOtp = await this._otpService.hash(otp)
        await this._otpStoreService.saveOtp(savedVendor.id, hashedOtp, 120)
        await this._mailService.sendVerifiyRegisterOtp(savedVendor.email, savedVendor.fullName, otp)

        return {
            success: true
        }
    }
}

