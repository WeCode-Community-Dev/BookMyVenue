package com.bookmyvenue.backend.controller;
import com.bookmyvenue.backend.dto.Book.BookingRequest;
import com.bookmyvenue.backend.dto.Book.BookingResponse;
import com.bookmyvenue.backend.dto.Book.BookingStatusRequest;
import com.bookmyvenue.backend.service.BookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
    @RequestMapping("/api/bookings")
    @RequiredArgsConstructor
    @Tag(name = "Booking Management")
    public class BookingController {

        private final BookingService bookingService;

        @PostMapping
        public ResponseEntity<BookingResponse>
        createBooking(
                @RequestBody
                BookingRequest request) {

            return ResponseEntity.ok(
                    bookingService.createBooking(
                            request));
        }

        @GetMapping("/{bookingId}")
        public ResponseEntity<BookingResponse>
        getBooking(
                @PathVariable Long bookingId) {

            return ResponseEntity.ok(
                    bookingService.getBookingById(
                            bookingId));
        }

        @GetMapping
        public ResponseEntity<List<BookingResponse>>
        getAllBookings() {

            return ResponseEntity.ok(
                    bookingService.getAllBookings());
        }

        @GetMapping("/user/{userId}")
        public ResponseEntity<List<BookingResponse>>
        getBookingsByUser(
                @PathVariable Long userId) {

            return ResponseEntity.ok(
                    bookingService.getBookingsByUser(
                            userId));
        }

        @GetMapping("/owner/{ownerId}")
        public ResponseEntity<List<BookingResponse>>
        getBookingsByOwner(
                @PathVariable Long ownerId) {

            return ResponseEntity.ok(
                    bookingService.getBookingsByOwner(
                            ownerId));
        }

        @PatchMapping("/{bookingId}/status")
        public ResponseEntity<BookingResponse>
        updateStatus(
                @PathVariable Long bookingId,
                @RequestBody
                BookingStatusRequest request) {

            return ResponseEntity.ok(
                    bookingService
                            .updateBookingStatus(
                                    bookingId,
                                    request));
        }

        @PutMapping("/{bookingId}/cancel")
        public ResponseEntity<Void>
        cancelBooking(
                @PathVariable Long bookingId) {

            bookingService.cancelBooking(
                    bookingId);

            return ResponseEntity.noContent()
                    .build();
        }

        @PostMapping("/search")
        public ResponseEntity<List<BookingResponse>>
        searchBookings(
                @RequestBody
                BookingRequest request) {

            return ResponseEntity.ok(
                    bookingService.searchBookings(
                            request));
        }
    }

