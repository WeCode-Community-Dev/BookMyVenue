class User {
    constructor({
        fullName,
        email,
        phone,
        password,
        role
    }){
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }
}

export default User;