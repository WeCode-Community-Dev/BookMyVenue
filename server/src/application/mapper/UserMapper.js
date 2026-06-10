class UserMapper {
    toDTO(user) {
        if (!user) return null;

        const obj = user.toObject ? user.toObject() : { ...user };

        return {
            id: obj._id,
            fullName: obj.fullName,
            email: obj.email,
            phone: obj.phone,
            role: obj.role,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt
        };
    }

    toDTOList(users) {
        return users.map((user) => this.toDTO(user));
    }
}

export default new UserMapper();
