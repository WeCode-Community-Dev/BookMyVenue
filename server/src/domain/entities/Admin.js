export class AdminEntity {
    constructor({
        id,
        fullName,
        email,
        password = null,
        role,
        isDeleted = false,
        createdAt,
        updatedAt,
    }) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

