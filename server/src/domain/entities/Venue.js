import { VenueStatus } from "../enums/Venue.enum.js";
import { VenueApprovalStatus } from "../enums/Venue.enum.js";

export class VenueEntity {
    constructor ({
    id,
    name,
    vendorId,
    description,
    category,
    websiteUrl,
    address = {
        addressLine1: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        phone: '',
        googleMapLink: ''
    },
    seatingCapacity = 0,
    standingCapacity = 0,
    pricePerHour = 0,
    pricePerDay = 0,
    securityDeposit = 0,
    availabilityRules = {},
    weekendSurcharge = 0,
    minimumBookingHours = 0,
    amenities = [],
    images = [],
    status = VenueStatus.PENDING,
    isDeleted = false,
    rating = 0,
    reviews = [],
    approvalStatus = VenueApprovalStatus.PENDING,
    isBlocked = false,
    rejectionReason = null

    } = {}) {
        this.id = id;
        this.vendorId = vendorId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.websiteUrl = websiteUrl;
        this.address = address;
        // this.addressLine1 = addressLine1;
        // this.city = city;
        // this.state = state;
        // this.country = country;
        // this.pincode = pincode;
        // this.phone = phone;
        // this.googleMapLink = googleMapLink;
        this.seatingCapacity = seatingCapacity;
        this.standingCapacity = standingCapacity;
        this.pricePerDay = pricePerDay;
        this.pricePerHour = pricePerHour;
        this.securityDeposit = securityDeposit;
        this.weekendSurcharge = weekendSurcharge;
        this.minimumBookingHours = minimumBookingHours;
        this.availabilityRules = availabilityRules;
        this.amenities = amenities;
        this.images = images;
        this.status = status;
        this.rating = rating;
        this.reviews = reviews;
        this.isDeleted = isDeleted;
        this.approvalStatus = approvalStatus,
        this.isBlocked = isBlocked,
        this.rejectionReason = rejectionReason
    }    
}