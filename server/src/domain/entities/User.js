class User {
    constructor({
        fullName,
        email,
        phone,
        password,
        role,
        isVerified = false,
        profileImage="",
        isBlocked=false,
        wishlist=[]
    }){
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.profileImage=profileImage;
        this.isVerified=isVerified;
        this.isBlocked=isBlocked;
        this.wishlist=wishlist
    }
}

export default User;