package com.bookmyvenue.backend.controller;

import com.bookmyvenue.backend.dto.Venue.VenueCreationRequest;
import com.bookmyvenue.backend.dto.Venue.VenueCreationResponse;
import com.bookmyvenue.backend.service.VenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
@Tag(name = "Venue Management")
public class VenueController {

    private final VenueService venueService;

    @PostMapping
    @Operation(summary = "Create Venue")
    public ResponseEntity<VenueCreationResponse>
    createVenue(
            @Valid
            @RequestBody VenueCreationRequest request) {

        return ResponseEntity.ok(
                        venueService.createVenue(request));
    }

    @GetMapping("/{venueId}")
    @Operation(summary = "Get Venue By Id")
    public ResponseEntity<VenueCreationResponse>
    getVenue(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                        venueService.getVenueById(
                                venueId));
    }

    @GetMapping
    @Operation(summary = "Get All Venues")
    public ResponseEntity<List<VenueCreationResponse>>
    getAllVenues() {

        return ResponseEntity.ok(
                        venueService.getAllVenues());
    }

    @PutMapping("/{venueId}")
    @Operation(summary = "Update Venue")
    public ResponseEntity<VenueCreationResponse>
    updateVenue(
            @PathVariable Long venueId,
            @RequestBody VenueCreationRequest request) {

        return ResponseEntity.ok(
                        venueService.updateVenue(
                                venueId,
                                request));
    }

    @DeleteMapping("/{venueId}")
    @Operation(summary = "Delete Venue")
    public ResponseEntity<String>
    deleteVenue(
            @PathVariable Long venueId) {

        venueService.deleteVenue(venueId);

        return ResponseEntity.noContent().build();
    }
}