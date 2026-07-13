package com.bookmyvenue.server.booking.controller;

import com.bookmyvenue.server.booking.dto.response.AvailabilityResponse;
import com.bookmyvenue.server.booking.service.AvailabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@Tag(name = "Availability")
@RequestMapping("/api/v1/venues")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;
    @GetMapping("/{venueId}/availability")
    @Operation(summary = "Get Venue Availability")
    public ResponseEntity<List<AvailabilityResponse>>
    getAvailability(
            @PathVariable Long venueId,
            @RequestParam LocalDate date
    ) {

        return ResponseEntity.ok(
                availabilityService.getAvailability(
                        venueId,
                        date
                )
        );
    }
}