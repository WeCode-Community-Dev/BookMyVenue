package com.example.bookMyVenue.Booking.Controller;


import com.example.bookMyVenue.Booking.DTO.BookingCreateRequest;
import com.example.bookMyVenue.Booking.DTO.BookingRequest;
import com.example.bookMyVenue.Booking.DTO.BookingResponse;
import com.example.bookMyVenue.Booking.Service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/venue/{venueId}/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @PathVariable Long venueId,
            @Valid @RequestBody BookingCreateRequest request) {

        BookingResponse response = bookingService.createBooking(venueId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBooking(
            @PathVariable Long venueId, @PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBooking(bookingId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getVenueBookings(@PathVariable Long venueId) {
        return ResponseEntity.ok(bookingService.getVenueBookings(venueId));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<String> cancelBooking(
            @PathVariable Long venueId, @PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok("Booking cancelled successfully");
    }
}
