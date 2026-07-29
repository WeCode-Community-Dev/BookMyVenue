import { VenueEntity } from '../../domain/entities/Venue.js'
import { Types } from 'mongoose'


export class VenueMapper {
    static mapToEntity(doc){
        console.log("VENUE DOC:", doc);
        const venue = new VenueEntity({
            id: doc._id.toString(),
            name: doc.name,
           //vendorId: doc.vendorId ? doc.vendorId.toString() : null,
           vendorId: doc.vendorId
  ? {
      id: doc.vendorId._id?.toString(),
      fullName: doc.vendorId.fullName,
      email: doc.vendorId.email,
      phone: doc.vendorId.phone,
      companyName: doc.vendorId.companyName,
    }
  : null,
            
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
            license: doc.license,
            // status: doc.status,
            isDeleted: doc.isDeleted,
            rating: doc.rating,
            reviews: doc.reviews,
            approvalStatus : doc.approvalStatus,
            isBlocked : doc.isBlocked,
            rejectionReason : doc.rejectionReason
        })
        return venue
    }
    static mapToPersistence(entity){
        return {
            name: entity.name,
            vendorId: entity.vendorId ?  new Types.ObjectId(entity.vendorId) : null,
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
            license: entity.license,
            // status: entity.status,
            isDeleted: entity.isDeleted,
            rating: entity.rating,
            reviews: entity.reviews,
            approvalStatus : entity.approvalStatus,
            isBlocked : entity.isBlocked,
            rejectionReason : entity.rejectionReason
        }
    }
}