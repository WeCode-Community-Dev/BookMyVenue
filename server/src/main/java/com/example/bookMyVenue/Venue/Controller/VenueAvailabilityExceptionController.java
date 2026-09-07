package com.example.bookMyVenue.Venue.Controller;

import com.example.bookMyVenue.Venue.DTO.VenueAvailabilityExceptionRequest;
import com.example.bookMyVenue.Venue.DTO.VenueAvailabilityExceptionResponse;
import com.example.bookMyVenue.Venue.Service.VenueAvailabilityExceptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/owner/venue/{venueId}/exceptions")
@RequiredArgsConstructor
public class VenueAvailabilityExceptionController {

    private final VenueAvailabilityExceptionService exceptionService;

    @PostMapping
    public ResponseEntity<VenueAvailabilityExceptionResponse> createException(
            @PathVariable Long venueId,
            @Valid @RequestBody VenueAvailabilityExceptionRequest request) {

        VenueAvailabilityExceptionResponse response =
                exceptionService.createException(venueId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<VenueAvailabilityExceptionResponse>> getExceptions(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(exceptionService.getExceptions(venueId));
    }

    @PutMapping("/{exceptionId}/cancel")
    public ResponseEntity<String> cancelException(
            @PathVariable Long venueId,
            @PathVariable Long exceptionId) {

        exceptionService.cancelException(exceptionId);
        return ResponseEntity.ok("Exception cancelled successfully");
    }
}
