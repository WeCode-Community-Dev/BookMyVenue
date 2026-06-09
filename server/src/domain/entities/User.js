class User {
    constructor({
        fullName,
        email,
        phone,
        password,
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