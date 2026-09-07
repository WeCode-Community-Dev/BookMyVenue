package com.example.bookMyVenue.Venue.Controller;

import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Venue.DTO.ActionRequest;
import com.example.bookMyVenue.Venue.DTO.VenueResponse;
import com.example.bookMyVenue.Venue.Service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin/venue")
@RequiredArgsConstructor
public class AdminVenueController {

    private final VenueService venueService;

    @GetMapping()
    public ResponseEntity<List<VenueResponse>> getAllVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<VenueResponse>> getPendingVenues() {
        return ResponseEntity.ok(
                venueService.getVenuesByStatus(VenueVerificationStatus.PENDING)
        );
    }

    @GetMapping("/approved")
    public ResponseEntity<List<VenueResponse>> getApprovedVenues() {
        return ResponseEntity.ok(
                venueService.getVenuesByStatus(VenueVerificationStatus.VERIFIED)
        );
    }
    @GetMapping("/rejected")
    public ResponseEntity<List<VenueResponse>> getRejectedVenues() {
        return ResponseEntity.ok(
                venueService.getVenuesByStatus(VenueVerificationStatus.REJECTED)
        );
    }

    @GetMapping("/{venueId}")
    public ResponseEntity<VenueResponse> getVenue(@PathVariable Long venueId) {
        return ResponseEntity.ok(venueService.getVenueResponseById(venueId));
    }

    @PutMapping("/{venueId}/approve")
    public ResponseEntity<String> approveVenue(@PathVariable Long venueId) {
        venueService.updateVenueStatus(venueId, VenueVerificationStatus.VERIFIED,null);
        return ResponseEntity.ok("Venue approved successfully");
    }

    @PutMapping("/{venueId}/reject")
    public ResponseEntity<String> rejectVenue(@PathVariable Long venueId,@Valid @RequestBody ActionRequest actionRequest) {
        venueService.updateVenueStatus(venueId, VenueVerificationStatus.REJECTED,actionRequest);
        return ResponseEntity.ok("Venue suspended successfully");
    }


}