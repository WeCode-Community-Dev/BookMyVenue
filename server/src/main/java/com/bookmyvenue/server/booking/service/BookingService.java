package com.bookmyvenue.server.booking.service;

import com.bookmyvenue.server.booking.dto.request.BookingRequest;
import com.bookmyvenue.server.booking.dto.response.BookingResponse;
import com.bookmyvenue.server.booking.enums.BookingStatus;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(
            Long venueId,
            Long slotTemplateId,
            BookingRequest request
    );

    List<BookingResponse> getMyBookings();

    void cancelBooking(Long bookingId);

    List<BookingResponse> getVendorBookings(BookingStatus status, Long venueId);
}