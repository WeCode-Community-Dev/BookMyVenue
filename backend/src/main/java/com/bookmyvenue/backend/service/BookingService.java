package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.Book.BookingRequest;
import com.bookmyvenue.backend.dto.Book.BookingResponse;
import com.bookmyvenue.backend.dto.Book.BookingStatusRequest;
import java.util.List;


    public interface BookingService {

        BookingResponse createBooking(
                BookingRequest request);

        BookingResponse getBookingById(
                Long bookingId);

        List<BookingResponse> getAllBookings();

        List<BookingResponse> getBookingsByUser(
                Long userId);

        List<BookingResponse> getBookingsByOwner(
                Long ownerId);

        BookingResponse updateBookingStatus(
                Long bookingId,
                BookingStatusRequest request);

        void cancelBooking(
                Long bookingId);

        List<BookingResponse> searchBookings(
                BookingRequest request);
    }

