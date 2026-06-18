import {
    createBookingService,
    getMyBookingsService,
    getOwnerBookingsService,
    updateBookingStatusService,
  } from "./bookings.service.js";
  
  import ApiResponse from "../../shared/utils/apiResponse.js";
  
  export const createBooking =
    async (req, res, next) => {
      try {
        const booking =
          await createBookingService(
            req.body,
            req.user.userId
          );
  
        return res.json(
          new ApiResponse(
            201,
            "Booking created",
            booking
          )
        );
      } catch (error) {
        next(error);
      }
    };
  
  export const getMyBookings =
    async (req, res, next) => {
      try {
        const bookings =
          await getMyBookingsService(
            req.user.userId
          );
  
        return res.json(
          new ApiResponse(
            200,
            "Bookings fetched",
            bookings
          )
        );
      } catch (error) {
        next(error);
      }
    };
  
  export const getOwnerBookings =
    async (req, res, next) => {
      try {
        const bookings =
          await getOwnerBookingsService(
            req.user.userId
          );
  
        return res.json(
          new ApiResponse(
            200,
            "Bookings fetched",
            bookings
          )
        );
      } catch (error) {
        next(error);
      }
    };
  
  export const updateBookingStatus =
    async (req, res, next) => {
      try {
        const booking =
          await updateBookingStatusService(
            req.params.id,
            req.body.status,
            req.user.userId
          );
  
        return res.json(
          new ApiResponse(
            200,
            "Booking updated",
            booking
          )
        );
      } catch (error) {
        next(error);
      }
    };