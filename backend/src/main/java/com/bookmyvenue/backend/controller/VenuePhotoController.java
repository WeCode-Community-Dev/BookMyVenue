package com.bookmyvenue.backend.controller;
import com.bookmyvenue.backend.dto.venuePhoto.VenuePhotoRequest;
import com.bookmyvenue.backend.dto.venuePhoto.VenuePhotoResponse;
import com.bookmyvenue.backend.service.VenuePhotoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venue-photos")
@RequiredArgsConstructor
@Tag(name = "Venue Photo API",
        description = "CRUD operations for Venue Photos")
public class VenuePhotoController {

    private final VenuePhotoService venuePhotoService;

    @PostMapping
    @Operation(summary = "Create venue photo")
    public ResponseEntity<VenuePhotoResponse> create(
            @Valid @RequestBody VenuePhotoRequest request) {

        return new ResponseEntity<>(
                venuePhotoService.create(request),
                HttpStatus.CREATED);
    }

    @GetMapping("/{photoId}")
    @Operation(summary = "Get venue photo by ID")
    public ResponseEntity<VenuePhotoResponse> getById(
            @PathVariable Long photoId) {

        return ResponseEntity.ok(
                venuePhotoService.getById(photoId));
    }

    @GetMapping("/venue/{venueId}")
    @Operation(summary = "Get all photos by venue ID")
    public ResponseEntity<List<VenuePhotoResponse>> getAllPhotoByVenueId(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                venuePhotoService.getAllPhotoByVenueId(venueId)
        );

    }

    @PutMapping("/{photoId}")
    @Operation(summary = "Update venue photo")
    public ResponseEntity<VenuePhotoResponse> update(
            @PathVariable Long photoId,
            @Valid @RequestBody VenuePhotoRequest request) {

        return ResponseEntity.ok(
                venuePhotoService.update(photoId, request));
    }

    @DeleteMapping("/{photoId}")
    @Operation(summary = "Delete venue photo")
    public ResponseEntity<Void> delete(
            @PathVariable Long photoId) {

        venuePhotoService.delete(photoId);

        return ResponseEntity.noContent().build();
    }
}