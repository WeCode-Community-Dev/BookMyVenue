class UserRepository {
    async create(data) {}
    async findById(id) {}
    async findAll() {}
    async update(id, data) {}
    async delete(id) {}
    async softDelete(id) {}
    async findByEmail(email, includePassword = false) {}
    async findByPhone(phone) {}
}

export default UserRepository;
