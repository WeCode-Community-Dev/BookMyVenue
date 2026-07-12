export class AdminEntity {
    constructor({
        id,
        fullName,
        email,
        password = null,
        role,
        isDeleted = false,
        refreshToken = [],
        createdAt,
        updatedAt,
    }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.refreshToken = refreshToken;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

