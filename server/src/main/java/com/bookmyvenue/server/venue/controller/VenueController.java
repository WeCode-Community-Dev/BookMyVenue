package com.bookmyvenue.server.venue.controller;

import com.bookmyvenue.server.venue.dto.request.CreateVenueRequest;
import com.bookmyvenue.server.venue.dto.request.UpdateVenueRequest;
import com.bookmyvenue.server.venue.dto.response.VenueResponse;
import com.bookmyvenue.server.venue.service.VenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Venue Management")
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping("/vendor/venues")
    @Operation(summary = "Create Venue")
    @PreAuthorize("hasRole('VENDOR')")
    @ResponseStatus(HttpStatus.CREATED)
    public VenueResponse createVenue(
            @RequestBody CreateVenueRequest request
    ) {
        System.out.println("CREATE VENUE CONTROLLER HIT");
        return venueService.createVenue(request);
    }

    @GetMapping("/vendor/venues")
    @PreAuthorize("hasRole('VENDOR')")
    @Operation(summary = "Get Vendor Venues")
    @ResponseStatus(HttpStatus.OK)
    public List<VenueResponse> getAllVenues(){
        return venueService.getAllVenues();
    }

    @GetMapping("/vendor/venues/{venueId}")
    @Operation(summary = "Get Vendor Venue")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('VENDOR')")
    public VenueResponse getVenue(@PathVariable Long venueId){
        return venueService.getVenue(venueId);
    }

    @GetMapping("/venues")
    @ResponseStatus(HttpStatus.OK)
    public List<VenueResponse> getApprovedVenues(
                                                   @RequestParam(required = false) String search,
                                                   @RequestParam(required = false) String district,
                                                   @RequestParam(required = false) Long categoryId) {
        return venueService.getApprovedVenues(search,district,categoryId);
    }

    @GetMapping("/venues/{id}")
    @Operation(summary = "Browse Venues")
    @ResponseStatus(HttpStatus.OK)
    public VenueResponse getApprovedVenue(
            @PathVariable Long id
    ) {
        return venueService.getApprovedVenue(id);
    }

    @PatchMapping("/venues/{id}")
    @Operation(summary = "Update Venue")
    @PreAuthorize("hasRole('VENDOR')")
    @ResponseStatus(HttpStatus.OK)
    public VenueResponse updateVenue(
            @PathVariable Long id,
            @RequestBody UpdateVenueRequest request
    ) {
        return venueService.updateVenue(id, request);
    }

    @DeleteMapping("/venues/{id}")
    @Operation(summary = "Delete Venue")
    @PreAuthorize("hasRole('VENDOR')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVenue(
            @PathVariable Long id
    ) {
        venueService.deleteVenue(id);
    }
}
