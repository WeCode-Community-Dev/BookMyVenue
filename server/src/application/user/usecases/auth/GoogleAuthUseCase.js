import { UserEntity } from "../../../../domain/entities/User.js";
import { UserRole } from "../../../../domain/enums/UserRole.enum.js";

export default class GoogleAuthUseCase {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async execute(profile) {
        const { id: googleId, displayName, emails } = profile;
        const email = emails[0].value;

        // Check if user already exists by googleId
        let user = await this._userRepository.findByGoogleId(googleId);

        if (user) {
            return user;
        }

        // Check if user exists with same email (registered normally before)
        user = await this._userRepository.findByEmail(email);

        if (user) {
            // Link googleId to existing account
            return await this._userRepository.update(user.id, {
                ...user,
                googleId
            });
        }

        // New user — create account (no password, OTP auto-verified)
        const userEntity = new UserEntity({
            fullName: displayName,
            email,
            googleId,
            role: UserRole.CUSTOMER,
            isOtpVerified: true  // Google already verified the email
        });

        return await this._userRepository.create(userEntity);
    }
}
