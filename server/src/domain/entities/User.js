class UserEntity {
    constructor({
        id,
        fullName,
        email,
        phone,
        password = null,
        role,
        isDeleted = false,
    
        
        
    }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.isDeleted = isDeleted;
        
        
        
    }
}

export default UserEntity;
