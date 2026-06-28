export class UserEntity {
    constructor({
        id,
        fullName,
        email,
        phone,
        password,
        role,
        isOtpVerified = false,
        isBlocked = false,
        createdAt,
        updatedAt,
        refreshToken
    }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.isOtpVerified = isOtpVerified;
        this.isBlocked = isBlocked;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.refreshToken = refreshToken;

    }
}

