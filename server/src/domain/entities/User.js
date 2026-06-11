export class UserEntity {
    constructor({
        id,
        fullName,
        email,
        phone,
        password,
        role,
        isOtpVerified = false,
        isBlocked = false
    }){
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.isOtpVerified = isOtpVerified;
        this.isBlocked = isBlocked;
    }
}
