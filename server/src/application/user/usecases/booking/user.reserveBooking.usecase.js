import crypto from "crypto";

import { VenueStatus } from "../../../../domain/enums/Venue.enum.js";
import { ValidationError } from "../../../../domain/errors/ValidationError.js";
import { ConflictError } from "../../../../domain/errors/ConflictError.js";
import { NotFoundError } from "../../../../domain/errors/NotFoundError.js";

import { BookingMessages } from "../../../../shared/constants/messages/bookingMessages.js";

export class UserReserveBookingUsecase{
    constructor(bookingRepository,venueRepository,redisService){
        this._bookingRepository = bookingRepository;
        this._venueRepository = venueRepository;
        this._redisService = redisService;
    }

    async execute(userId,bookingData){
        const{
            venueId,
            bookingDate,
            startTime,
            endTime,
            guestCount,
            bookingType
        }=bookingData
        

        //venu validation

        const venue = await this._venueRepository.findById(venueId);

        if(!venue){
            throw new NotFoundError(
                BookingMessages.error.VENUE_NOT_FOUND
            )
        }
        if(venue.isDeleted){
            throw new ValidationError(BookingMessages.error.VENUE_DELETED)
        }
        if(venue.isBlocked){
            throw new ValidationError(BookingMessages.error.VENUE_BLOCKED)
        }

        if(venue.approvalStatus !== VenueStatus.ACTIVE){
            throw new ValidationError(BookingMessages.error.VENUE_NOT_APPROVED)
        }
        //date validate ,only date,time next

        const today=new Date()
        const selectedDate=new Date(bookingDate)

        today.setHours(0,0,0,0)
        selectedDate.setHours(0,0,0,0)

        if(selectedDate<today){
            throw new ValidationError(BookingMessages.error.BOOKING_DATE_INVALID)
        }

        //convert time and validate for same day
        const[startHour,startMinute]=startTime.split(":").map(Number)
        const [endHour,endMinute]=endTime.split(":").map(Number)

        const bookingStartMinutes=startHour*60+startMinute;
        const bookingEndMinutes=endHour*60+endMinute

        const currentDate=new Date()
        const isToday=currentDate.toDateString()===new Date(bookingDate).toDateString()

        if(isToday){
            const currentMinutes=currentDate.getHours()*60+currentDate.getMinutes()

            if(bookingStartMinutes<=currentMinutes){
                throw new ValidationError(BookingMessages.error.BOOKING_TIME_INVALID)
            }
        }

        //venue time validation
        const [openHour, openMinute]=venue.availabilityRules.openTime.split(":").map(Number)
        const [closeHour,closeMinute]=venue.availabilityRules.closeTime.split(":").map(Number)

        const venueOpenMinutes=openHour*60+openMinute;
        const venueCloseMinutes=closeHour*60+closeMinute

        if(bookingStartMinutes<venueOpenMinutes ||
            bookingEndMinutes >venueCloseMinutes ||
            bookingStartMinutes>=bookingEndMinutes
        ){
            throw new ValidationError(BookingMessages.error.BOOKING_TIME_INVALID)
        }

        //closeDay && min bookhours(not compulsary)
        const dayName = selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
        });

        if (venue.availabilityRules.closedDays.includes(dayName)) {
            throw new ValidationError(
                BookingMessages.error.VENUE_CLOSED
            );
        }
        const bookingDuration =
            (bookingEndMinutes - bookingStartMinutes) / 60;

        if (bookingDuration < venue.minimumBookingHours) {
            throw new ValidationError(
                BookingMessages.error.MINIMUM_BOOKING_HOURS
            );
        }

        //capacity validation(no of seats/person)
        //chnage if both capacity included(means if a venue have both seting and standing capacity.)

        const maxCapacity=Math.max(venue.seatingCapacity,venue.standingCapacity)
        if(guestCount>maxCapacity){
            throw new ValidationError(BookingMessages.error.CAPACITY_EXCEEDED)
        }

        //overlap time cheak

      const hasOverlappingBooking =
        await this._bookingRepository.hasOverlappingBooking(
            venueId,
            selectedDate,
            startTime,
            endTime
        );

        if (hasOverlappingBooking) {
        throw new ConflictError(
            BookingMessages.error.SLOT_ALREADY_BOOKED
        );
        }
        //check redis service(temporarly locked slot)

        const reservationKey = `reservation:${venueId}:${selectedDate.toISOString().split("T")[0]}`;
        const reservations=await this._redisService.getReservation(reservationKey)
        if(reservations && reservations.length>0){
            const hasOverlappingReservation=reservations.some(
                (reservation)=>
                    reservation.startTime <endTime &&
                reservation.endTime >startTime
            );
            if(hasOverlappingReservation){
                throw new ConflictError(BookingMessages.error.SLOT_TEMPORARILY_RESERVED)
            }
        }
        // check booking amount
        let bookingAmount = 0;

        if (bookingType === "hourly") {
            bookingAmount = bookingDuration * venue.pricePerHour;
        } else if (bookingType === "daily") {
            bookingAmount = venue.pricePerDay;
        } else {
            throw new ValidationError(
                BookingMessages.error.INVALID_BOOKING_TYPE
            );
        }

        // Add weekend surcharge
        const bookingDay = selectedDate.getDay();

        const isWeekend =bookingDay === 0 || bookingDay === 6;

        const weekendCharge = isWeekend? (venue.weekendSurcharge || 0): 0;

        const securityDeposit =venue.securityDeposit || 0;

            const totalAmount = bookingAmount + weekendCharge +securityDeposit;
            // Calculate advance payment
        const hoursDifference =(selectedDate - today) / (1000 * 60 * 60);

        let advanceAmount = 0;
        let remainingAmount = 0;

        if (hoursDifference > 72) {
            advanceAmount = Math.round(totalAmount * 0.2);
            remainingAmount = totalAmount - advanceAmount;
        } else {
            advanceAmount = totalAmount;
            remainingAmount = 0;
        }
        const reservationId=crypto.randomUUID()
        const expiresAt=new Date(Date.now()+600*1000)

        //create reservation data//check again after booking success
        const reservationData = {
            reservationId,
            userId,
            venueId,
            bookingDate,
            startTime,
            endTime,
            guestCount,
            bookingType,
            totalAmount,
            advanceAmount,
            remainingAmount,
            expiresAt,
            vendorId: venue.vendorId,
        }

        const reservationList=reservations || []

        reservationList.push(reservationData)

        await this._redisService.reserveSlot(reservationKey,reservationList,600)


        return {
        reservationId,
        venueId,
        bookingDate,
        startTime,
        endTime,
        guestCount,
        bookingType,
        totalAmount,
        advanceAmount,
        remainingAmount,
        expiresAt
    };
        
    }
}
