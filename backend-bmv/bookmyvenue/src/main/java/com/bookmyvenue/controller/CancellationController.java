package com.bookmyvenue.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.bookmyvenue.dto.CancelRequest;
import com.bookmyvenue.dto.CancelReviewRequest;
import com.bookmyvenue.dto.CancellationResponse;
import com.bookmyvenue.service.CancellationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CancellationController {

    private final CancellationService cancellationService;
    
    @PostMapping("/api/user/bookings/{bookingId}/cancel")
    public ResponseEntity<CancellationResponse> requestCancellation(
            @PathVariable Integer bookingId,
            @RequestBody CancelRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
            cancellationService.requestCancellation(bookingId, request, userDetails.getUsername())
        );
    }

    // OWNER: get all cancel requests for their venues
    @GetMapping("/api/owner/cancellations")
    public ResponseEntity<List<CancellationResponse>> getCancelRequests(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
            cancellationService.getCancelRequestsForOwner(userDetails.getUsername())
        );
    }

    // OWNER: approve or reject a cancel request
    @PatchMapping("/api/owner/cancellations/{id}/review")
    public ResponseEntity<CancellationResponse> reviewCancellation(
            @PathVariable Integer id,
            @RequestBody CancelReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
            cancellationService.reviewCancellation(id, request, userDetails.getUsername())
        );
    }
}