package com.bookmyvenue.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookmyvenue.dto.BookingRequest;
import com.bookmyvenue.dto.BookingResponse;
import com.bookmyvenue.dto.VenueResponse;
import com.bookmyvenue.dto.VenueSearchDocument;
import com.bookmyvenue.service.MeilisearchService;
import com.bookmyvenue.service.UserService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final MeilisearchService meilisearchService;
    
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
    public ResponseEntity<Page<BookingResponse>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails, @PageableDefault(size = 10, sort ="bookedOn", direction= Sort.Direction.DESC)Pageable pageable){
        return ResponseEntity.ok(userService.getMyBookings(userDetails.getUsername(),pageable));
    }

    @GetMapping("/venues/search")
    public ResponseEntity<List<VenueSearchDocument>> searchVenues(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String venueType,
        @RequestParam(required = false) Integer minPrice,
        @RequestParam(required = false) Integer maxPrice) {

        return ResponseEntity.ok(
            meilisearchService.searchVenues(q, venueType, minPrice, maxPrice)
        );
    }
}
