
import {db} from '../db/index.js'
import {venuesTable, venuePricing} from '../models/venueModel.js'
import {venueAmenities} from '../models/amenityModel.js'

export default {

    isReadyForReview : (payload) => {
    const check = {
    hasPincode: !!payload.pincode,
    hasImages: payload.images?.length > 0,
    hasOpenDays: payload.openDays?.length > 0,
    hasOpenTime: !!payload.openTime,
    hasCloseTime: !!payload.closeTime,
    hasPricing: payload.pricing?.length > 0,
    hasAmenities: payload.amenities?.length > 0,
    }
    const isReady = Object.values(check).every(Boolean);
    return { isReady, check };
},

    addVenue:  async function(payload){

    const status = this.isReadyForReview(payload);

    const venue = await db.transaction( async(tx) => {

        const venueData = {
            ownerId: payload.ownerId,
            name: payload.name,
            description: payload.description,
            type: payload.type,
            address: payload.address,
            city: payload.city,
            state: payload.state,
            pincode: payload.pincode,
            latitude: payload.latitude,
            longitude: payload.longitude,
            capacity: payload.capacity,
            images: payload.images,
            openDays: payload.openDays,
            openTime: payload.openTime,
            closeTime: payload.closeTime,
            minBookingHours: payload.minBookingHours,
            isActive: false,
            approvalStatus: status.isReady ? 'pending' : 'draft',

        }
        console.log(venueData,"venue")
        const [venue] = await tx.insert(venuesTable).values(venueData).returning(); 

        if(payload.pricing && payload.pricing.length > 0){
            await tx.insert(venuePricing).values(payload.pricing.map((p) => ({
                venueId: venue.id,
                dayType: p.dayType,
                pricePerHour: p.pricePerHour,
                minHours: p.minHours,
                validFrom: new Date(), // set current date as valid_from
                validTo: p.validTo ? new Date(p.validTo) : null, // set valid_to if provided

            })))  
        };

        if(payload.amenities && payload.amenities.length > 0){
            // logic to insert into venue_amenities table
            await tx.insert(venueAmenities).values(
                payload.amenities.map(amenityId => ({
                    venueId: venue.id,
                    amenityId: amenityId
                }))
            );
            }
        return venue;
    })

    return {venue: venue, isReadyForReview: status.isReady, reviewChecklist: status.check};
    },
}

