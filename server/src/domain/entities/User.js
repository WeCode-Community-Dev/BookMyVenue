class UserEntity {
    constructor({
        id,
        fullName,
        email,
        phone,
        password = null,
        role,
        isDeleted = false,
        refreshToken = null,
        createdAt,
        updatedAt
    }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
        this.isDeleted = isDeleted;
        this.refreshToken = refreshToken;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default UserEntity;
