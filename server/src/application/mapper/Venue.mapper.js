import { VenueEntity } from '../../domain/entities/Venue.js'
import { Types } from 'mongoose'


export class VenueMapper {
    static mapToEntity(doc){
        const venue = new VenueEntity(
            doc._id.toString(),
            doc.name,
            doc.ownerId ? doc.ownerId.toString() : null,
            doc.description,
            doc.category,
            doc.websiteUrl,
            doc.address,
            doc.seatingCapacity,
            doc.standingCapacity,
            doc.pricePerHour,
            doc.pricePerDay,
            doc.securityDeposit,
            doc.availabilityRules,
            doc.weekendSurcharge,
            doc.minimumBookingHours,
            doc.amenities,
            doc.images,
            doc.status,
            doc.isDeleted,
            doc.rating,
            doc.reviews,
            doc.isAdminVerified
        )
        return venue
    }
    static mapToPersistence(entity){
        return {
            name: entity.name,
            ownerId: entity.ownerId ?  new Types.ObjectId(entity.ownerId) : null,
            description: entity.description,
            category: entity.category,
            websiteUrl: entity.websiteUrl,
            address: entity.address,
            seatingCapacity: entity.seatingCapacity,
            standingCapacity: entity.standingCapacity,
            pricePerHour: entity.pricePerHour,
            pricePerDay: entity.pricePerDay,
            securityDeposit: entity.securityDeposit,
            availabilityRules: entity.availabilityRules,
            weekendSurcharge: entity.weekendSurcharge,
            minimumBookingHours: entity.minimumBookingHours,
            amenities: entity.amenities,
            images: entity.images,
            status: entity.status,
            isDeleted: entity.isDeleted,
            rating: entity.rating,
            reviews: entity.reviews,
            isAdminVerified: entity.isAdminVerified
        }
    }
}