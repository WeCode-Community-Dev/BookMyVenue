package com.bookmyvenue.backend.controller;
import com.bookmyvenue.backend.dto.venuAvailability.VenueAvailabilityRequest;
import com.bookmyvenue.backend.dto.venuAvailability.VenueAvailabilityResponse;
import com.bookmyvenue.backend.service.VenueAvailabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
@Tag(name = "Venue Availability")
public class VenueAvailabilityController {

    private final VenueAvailabilityService service;

    @Operation(summary = "Create availability")
    @PostMapping
    public ResponseEntity<VenueAvailabilityResponse>
    create(
            @RequestBody
            VenueAvailabilityRequest request) {

        return ResponseEntity.ok(
                service.create(request));
    }

    @Operation(summary = "Get availability by ID")
    @GetMapping("/{id}")
    public ResponseEntity<VenueAvailabilityResponse>
    getById(@PathVariable Long id) {

        return ResponseEntity.ok(
                service.getById(id));
    }

    @Operation(summary = "Get all availability")
    @GetMapping
    public ResponseEntity<List<VenueAvailabilityResponse>>
    getAll() {

        return ResponseEntity.ok(
                service.getAll());
    }

    @Operation(summary = "Get availability by venue")
    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<VenueAvailabilityResponse>>
    getByVenueId(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                service.getByVenueId(venueId));
    }

    @Operation(summary = "Update availability")
    @PutMapping("/{id}")
    public ResponseEntity<VenueAvailabilityResponse>
    update(
            @PathVariable Long id,
            @RequestBody VenueAvailabilityRequest request) {

        return ResponseEntity.ok(
                service.update(id, request));
    }

    @Operation(summary = "Delete availability")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}