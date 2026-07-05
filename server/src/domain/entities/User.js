export class UserEntity {
    constructor({
        id,
        fullName,
        email,
        phone,
        password,
        role,
        isVerified = false,
        isOtpVerified = false,
       profileImage = {
            publicId: "",
            url: ""
        },
        isBlocked = false,
        wishlist = [],
        createdAt,
        updatedAt,
        refreshToken,
        pendingEmail = null,
        otpCode = null,
        otpExpiresAt = null
    }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.isVerified = isVerified;
        this.isOtpVerified = isOtpVerified;
        this.profileImage = profileImage;
        this.isBlocked = isBlocked;
        this.wishlist = wishlist;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.refreshToken = refreshToken;
        this.pendingEmail = pendingEmail;
        this.otpCode = otpCode;
        this.otpExpiresAt = otpExpiresAt;
    }
}