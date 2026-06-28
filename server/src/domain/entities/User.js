export class UserEntity {
    constructor({
        id,
        fullName,
        email,
        phone = null,
        password = null,
        googleId = null,
        role,
        isOtpVerified = false,
        otpCode,
        otpExpiresAt,
        isBlocked = false,
        createdAt,
        updatedAt,
        refreshToken,
        resetToken,
        resetTokenExpiry
    }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.googleId = googleId;
        this.role = role;
        this.isOtpVerified = isOtpVerified;
        this.otpCode = otpCode;
        this.otpExpiresAt = otpExpiresAt;
        this.isBlocked = isBlocked;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.refreshToken = refreshToken;
        this.resetToken = resetToken;
        this.resetTokenExpiry = resetTokenExpiry;
    }
}
