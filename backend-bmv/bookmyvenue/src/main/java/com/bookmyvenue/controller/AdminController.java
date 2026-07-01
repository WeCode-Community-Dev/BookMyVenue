package com.bookmyvenue.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookmyvenue.dto.BookingResponse;
import com.bookmyvenue.dto.UserResponse;
import com.bookmyvenue.dto.UserStatusRequest;
import com.bookmyvenue.dto.VenueResponse;
import com.bookmyvenue.dto.VenueReviewRequest;
import com.bookmyvenue.repository.VenueRepository;
import com.bookmyvenue.service.AdminService;
import com.bookmyvenue.service.MeilisearchService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final MeilisearchService meilisearchService;
    public final VenueRepository venueRepository;

    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(@PageableDefault(size = 10, sort ="createdAt", direction= Sort.Direction.DESC)Pageable pageable){
        return ResponseEntity.ok(adminService.getAllUsers(pageable));
    }

    @GetMapping("/venue/review")
    public ResponseEntity<List<VenueResponse>> getAllPendingReviews(){
        return ResponseEntity.ok(adminService.getAllPendingReviews());
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(@PathVariable Integer id, @RequestBody UserStatusRequest request){
        return ResponseEntity.ok(adminService.updateUserStatus(id, request));
    }

    @PatchMapping("/venue/{id}/review")
    public ResponseEntity<VenueResponse> reviewVenue(@PathVariable Integer id, @RequestBody VenueReviewRequest request){
        return ResponseEntity.ok(adminService.reviewVenue(id, request));
    }

    @GetMapping("/bookings")
    public ResponseEntity<Page<BookingResponse>> getAllBookings(@PageableDefault(size = 10, sort ="bookedOn", direction= Sort.Direction.DESC)Pageable pageable){
        return ResponseEntity.ok(adminService.getAllBookings(pageable));
    }

    @PatchMapping("/booking/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable Integer id, @RequestParam String bookingStatus){
        return ResponseEntity.ok(adminService.updateBookingStatus(id, bookingStatus));
    }

    @PatchMapping("/booking/{id}/payment/status")
    public ResponseEntity<BookingResponse> updatePaymentStatus(@PathVariable Integer id, @RequestParam String paymentStatus){
        return ResponseEntity.ok(adminService.updatePaymentStatus(id, paymentStatus));
    }

    @GetMapping("/venues")
    public ResponseEntity<Page<VenueResponse>> getAllVenues(@PageableDefault(size = 10, sort ="createdAt", direction= Sort.Direction.DESC)Pageable pageable){
        return ResponseEntity.ok(adminService.getAllVenues(pageable));
    }

    @PatchMapping("/venue/{id}/status")
    public ResponseEntity<VenueResponse> updateVenueStatus(@PathVariable Integer id, @RequestParam String status){
        return ResponseEntity.ok(adminService.updateVenueStatus(id, status));
    }
}
