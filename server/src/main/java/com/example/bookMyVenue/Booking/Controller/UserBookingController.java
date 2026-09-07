package com.example.bookMyVenue.Booking.Controller;

import com.example.bookMyVenue.Booking.DTO.BookingCreateRequest;
import com.example.bookMyVenue.Booking.DTO.BookingResponse;
import com.example.bookMyVenue.Booking.Service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/user/bookings")
@RequiredArgsConstructor
public class UserBookingController {

    private final BookingService bookingService;

    @GetMapping("/upcoming")
    public ResponseEntity<List<BookingResponse>> getUpcomingBookings(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<BookingResponse> response = bookingService.getUpcomingBookings(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/past")
    public ResponseEntity<List<BookingResponse>> getPastBookings(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<BookingResponse> response = bookingService.getPastBookings(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<BookingResponse> response = bookingService.getAllBookings(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}
