import { VenueMapper } from "../../application/mapper/Venue.mapper.js";
import { IVenueRepository } from "../../domain/repositories/IVenue.repository.js";
import { VenueModel } from "../database/Venue.model.js";


export class VenueRepository extends IVenueRepository {
    async findById(id){
        const document = await VenueModel.findById(id)
        if(!document) return null
        return VenueMapper.mapToEntity(document)
    }

    async create(venue){
        const data = VenueMapper.mapToPersistence(venue)
        const document = await VenueModel.create(data)
        return VenueMapper.mapToEntity(document)
    }

    async update(id, venue){
        const data = VenueMapper.mapToPersistence(venue)
        const document = await VenueModel.findByIdAndUpdate(
            id,
            { $set: data},
            { new: true }
        )
        if(!document) return null
        return VenueMapper.mapToEntity(document)
    }

    async findByOwnerAndName(ownerId, name) {
        const document = await VenueModel.findOne({
            ownerId,
            name
        })
        if(!document) return null
        return VenueMapper.mapToEntity(document)
    }

    // mapToEntity(doc){
    //     return VenueMapper.mapToEntity(doc)
    // }

    // mapToPersistence(entity){
    //     return VenueMapper.mapToPersistence(entity)
    // }
}