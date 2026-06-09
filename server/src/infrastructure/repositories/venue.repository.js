import { VenueMapper } from "../../application/mapper/Venue.mapper.js";
import { IVenueRepository } from "../../domain/repositories/IVenue.repository.js";
import { VenueModel } from "../database/Venue.model.js";


export class VenueRepository extends IVenueRepository {
    async findById(id){
        const document = await VenueModel.findById(id)
        console.log('from repo', document)
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

    async findAllFiltered(query = {}){
        const filter = {}
        if(query.ownerId){
            filter.ownerId = query.ownerId
        }
        if(query.status){
            filter.status = query.status
        }
        if(query.price){
            filter.$or = {
                pricePerHour: { $lte: query.price },
                pricePerDay: { $lte: query.price}
            }
        }
        if(query.search){
           filter.$or = {
            name: { $regex: query.search, $options: "i"},
            addressLine1: { $regex: query.search, $options: "i"},
            city: { $regex: query.search, $options: "i"},
            state: { $regex: query.search, $options: "i"}
           }
        }

        const skip = query.limit * ( query.page - 1)
        const totalCount = await VenueModel.countDocuments(filter)
        const totalPages = Math.ceil(totalCount/query.limit)
        const documents = await VenueModel.find(filter)
            .sort({createdAt: -1})
            .skip(skip)
            .limit(query.limit)
        return {
            data: documents,
            totalCount,
            totalPages
        }

    }

    // mapToEntity(doc){
    //     return VenueMapper.mapToEntity(doc)
    // }

    // mapToPersistence(entity){
    //     return VenueMapper.mapToPersistence(entity)
    // }
}