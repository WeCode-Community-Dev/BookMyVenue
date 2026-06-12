class UserEntity {
    constructor({
        id,
        fullName,
        email,
        phone,
        password = null,
        role,
        isVerified = false,
    }){
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }
}

export default User;