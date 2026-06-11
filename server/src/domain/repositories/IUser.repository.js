export class IUserRepository {
    async findById(id){
        throw new Error("Method not implemented")
    }

    async findAllFiltered(query = {}){
        throw new Error("Method not implemented")
    }

    async blockUser(id){
        throw new Error("Method not implemented")
    }

    async unblockUser(id){
        throw new Error("Method not implemented")
    }
}