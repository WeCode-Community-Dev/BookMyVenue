package com.bookmyvenue.server.booking.controller;

import com.bookmyvenue.server.booking.dto.request.BookingRequest;
import com.bookmyvenue.server.booking.dto.response.BookingResponse;
import com.bookmyvenue.server.booking.enums.BookingStatus;
import com.bookmyvenue.server.booking.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Booking Management")
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping(
            "/venues/{venueId}/slots/{slotTemplateId}/bookings"
    )
    @Operation(summary = "Create Booking")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(
            @PathVariable Long venueId,
            @PathVariable Long slotTemplateId,
            @RequestBody BookingRequest request
    ) {

        return bookingService.createBooking(
                venueId,
                slotTemplateId,
                request
        );
    }

    @GetMapping("/bookings/my-bookings")
    @Operation(summary = "Get My Bookings")
    @ResponseStatus(HttpStatus.OK)
    public List<BookingResponse> getMyBookings() {

        return bookingService.getMyBookings();
    }

    @PostMapping("/bookings/{bookingId}/cancel")
    @Operation(summary = "Cancel Booking")
    @ResponseStatus(HttpStatus.OK)
    public void cancelBooking(
            @PathVariable Long bookingId
    ) {

        bookingService.cancelBooking(
                bookingId
        );
    }

    @GetMapping("vendor/bookings")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Get all bookings for vendor")
    @ResponseStatus(HttpStatus.OK)
    public List<BookingResponse> getVendorBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) Long venueId
    ) {
        return bookingService.getVendorBookings(status, venueId);
    }
}
