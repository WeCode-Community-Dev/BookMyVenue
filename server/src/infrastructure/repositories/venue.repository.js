import { IVenueRepository } from "../../domain/repositories/IVenue.repository";
import { VenueModel } from "../database/Venue.model";


export class VenueRepository extends IVenueRepository {
    async findById(id){
        const documnet = await VenueModel.findById(id)
        if(!documnet) return null
        return this.mapToEntity(documnet)
    }

    async create(venue){
        const data = this.mapToPersistence(venue)
        const document = await VenueModel.create(data)
        return this.mapToEntity(document)
    }

    async update(id, venue){
        const data = this.mapToPersistence(venue)
        const document = await VenueModel.findByIdAndUpdate(
            id,
            { $set: data},
            { new: true }
        )
        if(!document) return null
        return this.mapToEntity(document)
    }
}