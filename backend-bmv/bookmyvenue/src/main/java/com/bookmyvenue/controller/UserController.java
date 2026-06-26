package com.bookmyvenue.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookmyvenue.dto.BookingRequest;
import com.bookmyvenue.dto.BookingResponse;
import com.bookmyvenue.dto.VenueResponse;
import com.bookmyvenue.service.UserService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    
    @GetMapping("/venues")
    public ResponseEntity<List<VenueResponse>> getApprovedVenues(){
        return ResponseEntity.ok(userService.getApprovedVenues());
    }

    @PostMapping("/booking")
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request, @AuthenticationPrincipal UserDetails userDetails){
        BookingResponse response = userService.createBooking(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/bookings/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails){
        return ResponseEntity.ok(userService.getMyBookings(userDetails.getUsername()));
    }
}
