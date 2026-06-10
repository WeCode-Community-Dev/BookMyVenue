import { VenueEntity } from '../../domain/entities/Venue.js'
import { Types } from 'mongoose'


export class VenueMapper {
    static mapToEntity(doc){
        const venue = new VenueEntity({
            id: doc._id.toString(),
            name: doc.name,
            ownerId: doc.ownerId ? doc.ownerId.toString() : null,
            description: doc.description,
            category: doc.category,
            websiteUrl: doc.websiteUrl,
            address: doc.address,
            seatingCapacity: doc.seatingCapacity,
            standingCapacity: doc.standingCapacity,
            pricePerHour: doc.pricePerHour,
            pricePerDay: doc.pricePerDay,
            securityDeposit: doc.securityDeposit,
            availabilityRules: doc.availabilityRules,
            weekendSurcharge: doc.weekendSurcharge,
            minimumBookingHours: doc.minimumBookingHours,
            amenities: doc.amenities,
            images: doc.images,
            status: doc.status,
            isDeleted: doc.isDeleted,
            rating: doc.rating,
            reviews: doc.reviews,
            isAdminVerified: doc.isAdminVerified
        })
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