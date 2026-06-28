import { NotFoundError } from "../../../domain/errors/NotFoundError.js";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError.js";
import { InternalServerError } from "../../../domain/errors/InternalServerError.js";

export default class ResetPasswordUseCase {
    constructor(userRepository, hashService) {
        this._userRepository = userRepository;
        this._hashService = hashService;
    }

    async execute(email, resetToken, newPassword) {

        // Validate password
        if (!newPassword || newPassword.trim().length < 8) {
            throw new UnauthorizedError(
                "Password must be at least 8 characters long"
            );
        }

        // Find user
        const user = await this._userRepository.findByEmail(email, true);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Check if a password reset request exists
        if (!user.resetToken || !user.resetTokenExpiry) {
            throw new UnauthorizedError(
                "No password reset request found for this email"
            );
        }

        // Verify token
        if (user.resetToken !== resetToken) {
            throw new UnauthorizedError("Invalid reset token");
        }

        // Check token expiry
        if (new Date() > new Date(user.resetTokenExpiry)) {
            throw new UnauthorizedError(
                "Password reset link has expired"
            );
        }

        // Hash new password
        const hashedPassword = await this._hashService.hash(newPassword);

        // Update password and clear reset fields
        const updatedUser = await this._userRepository.update(user.id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
        });

        if (!updatedUser) {
            throw new InternalServerError(
                "Failed to reset password"
            );
        }

        return {
            email: updatedUser.email,
            message:
                "Password reset successfully. You can now login with your new password.",
        };
    }
}