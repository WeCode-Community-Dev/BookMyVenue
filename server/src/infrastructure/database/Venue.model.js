import mongoose, { Schema, Types } from 'mongoose'
import { VenueCategory, VenueStatus } from '../../domain/enums/Venue.enum.js'

const VenueSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    vendorId: {
        type: Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    category: {
        type: String,
        enum: Object.values(VenueCategory),
        required: true
    },
    websiteUrl: {
        type: String,
        required: false
    },
    address: {
        addressLine1: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: String
        },
        phone: {
            type: String,
            required: true
        },
        googleMapLink: {
            type: String
        }
    },
    seatingCapacity: {
        type: Number,
        required: true,
        min: 1
    },
    standingCapacity: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerHour: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerDay: {
        type: Number,
        required: true,
        min: 1
    },
    availabilityRules: {
        openTime: {
            type: String,
            required: true,
            default: '08:00'
        },
        closeTime: {
            type: String,
            required: true,
            default: '22:00'
        },
        closedDays: {
            type: [String],
            default: []
        }
    },
    amenities: {
        type: [String],
        default: []
    },
    images: [{
        publicId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    securityDeposit: {
        type: Number,
        default: 0,
        min: 0
    },
    weekendSurcharge: {
        type: Number,
        default: 0,
        min: 0
    },
    minimumBookingHours: {
        type: Number,
        default: 1
    },
    // status: {
    //     type: String,
    //     enum: Object.values(VenueStatus),
    //     default: VenueStatus.PENDING
    // },
    license: [{
        publicId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        userId: {
            type: Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        review: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    rejectionReason: {
        type: String,
        default: null
    },
    approvalStatus : {
        type: String,
        enum:  Object.values(VenueStatus),
        default: VenueStatus.PENDING,
    }
}, {
    timestamps: true
})

export const VenueModel = mongoose.model('Venue', VenueSchema)