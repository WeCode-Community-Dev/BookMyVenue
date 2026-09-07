package com.example.bookMyVenue.Venue.Controller;

import com.example.bookMyVenue.Venue.DTO.VenueAvailabilityRulesRequest;
import com.example.bookMyVenue.Venue.DTO.VenueAvailabiltyRulesResponse;
import com.example.bookMyVenue.Venue.Service.VenueAvailabilityRulesService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/owner/venue/{venueId}/availability-rules")
@RequiredArgsConstructor
public class VenueAvailabilityRulesController {

    private final VenueAvailabilityRulesService venueAvailabilityRulesService;

    // Current rule actually governing bookings today
    @GetMapping("/active")
    public ResponseEntity<VenueAvailabiltyRulesResponse> getActiveRule(@PathVariable Long venueId) {
        return ResponseEntity.ok(venueAvailabilityRulesService.getActiveRule(venueId));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<VenueAvailabiltyRulesResponse> getUpcomingRule(@PathVariable Long venueId) {
        VenueAvailabiltyRulesResponse response = venueAvailabilityRulesService.getUpcomingRule(venueId);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.noContent().build();
    }

    // Full version history — no delete, so this is the permanent audit trail
    @GetMapping("/history")
    public ResponseEntity<List<VenueAvailabiltyRulesResponse>> getRuleHistory(@PathVariable Long venueId) {
        return ResponseEntity.ok(venueAvailabilityRulesService.getRuleHistory(venueId));
    }

    // Schedule a new rule — effectiveFrom is auto-computed, never accepted from the client
    @PostMapping
    public ResponseEntity<VenueAvailabiltyRulesResponse> createNewRule(
            @PathVariable Long venueId,
            @Valid @RequestBody VenueAvailabilityRulesRequest request) {

        VenueAvailabiltyRulesResponse response =
                venueAvailabilityRulesService.createNewRule(venueId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Edit an upcoming (not-yet-active) rule only
    @PutMapping("/{ruleId}")
    public ResponseEntity<VenueAvailabiltyRulesResponse> updateUpcomingRule(
            @PathVariable Long venueId,
            @PathVariable Long ruleId,
            @Valid @RequestBody VenueAvailabilityRulesRequest request) {

        VenueAvailabiltyRulesResponse response =
                venueAvailabilityRulesService.updateUpcomingRule(ruleId, request);

        return ResponseEntity.ok(response);
    }

}
