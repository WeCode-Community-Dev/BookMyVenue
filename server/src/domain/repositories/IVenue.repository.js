export class IVenueRepository {
    async create(venue){
        throw new Error('Method not implemnted')
    }
    async findById(id){
        throw new Error('Method not implemented')
    }
    async update(id, data){
        throw new Error('Method not implemented')
    }
    async findByOwnerAndName(query = {}){
        throw new Error('Method not implemented')
    }
    async delete(id){
        throw new Error('Method not implemented')
    }
    async findAllFiltered(ownerId, search, status, page, limit){
        throw new Error('Method not implemented')
    }
    // mapToEntity(doc){
    //     throw new Error('Method not implemented')
    // }
    // mapToPersistence(venue){
    //     throw new Error('Method not implemented')
    // }
}