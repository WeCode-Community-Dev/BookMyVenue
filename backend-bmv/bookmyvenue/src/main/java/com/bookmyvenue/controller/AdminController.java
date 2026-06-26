package com.bookmyvenue.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookmyvenue.dto.BookingResponse;
import com.bookmyvenue.dto.UserResponse;
import com.bookmyvenue.dto.UserStatusRequest;
import com.bookmyvenue.dto.VenueResponse;
import com.bookmyvenue.dto.VenueReviewRequest;
import com.bookmyvenue.service.AdminService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        return ResponseEntity.ok(adminService.getAllUsers());
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
    public ResponseEntity<List<BookingResponse>> getAllBookings(){
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @GetMapping("/venues")
    public ResponseEntity<List<VenueResponse>> getAllVenues(){
        return ResponseEntity.ok(adminService.getAllVenues());
    }
}
