package com.bookmyvenue.backend.controller;
import com.bookmyvenue.backend.dto.venueAmenity.AmenityRequest;
import com.bookmyvenue.backend.dto.venueAmenity.AmenityResponse;
import com.bookmyvenue.backend.service.AmenityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
@Tag(name = "Amenities", description = "APIs for managing amenities")
public class AmenityController {

    private final AmenityService amenityService;

    @PostMapping
    @Operation(
            summary = "Create Amenity",
            description = "Creates a new amenity"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201",
                    description = "Amenity created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AmenityResponse.class))),
            @ApiResponse(responseCode = "400",
                    description = "Invalid request")
    })
    public ResponseEntity<AmenityResponse> createAmenity(
            @Valid
            @RequestBody AmenityRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(amenityService.createAmenity(request));
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get Amenity By ID",
            description = "Retrieves an amenity by its ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Amenity found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AmenityResponse.class))),
            @ApiResponse(responseCode = "404",
                    description = "Amenity not found")
    })
    public ResponseEntity<AmenityResponse> getAmenityById(
            @Parameter(description = "Amenity ID", required = true)
            @PathVariable Long id) {

        return ResponseEntity.ok(
                amenityService.getAmenityById(id));
    }

    @GetMapping
    @Operation(
            summary = "Get All Amenities",
            description = "Retrieves all amenities"
    )
    @ApiResponse(responseCode = "200",
            description = "List of amenities",
            content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = AmenityResponse.class)))
    public ResponseEntity<List<AmenityResponse>> getAllAmenities() {

        return ResponseEntity.ok(
                amenityService.getAllAmenities());
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Update Amenity",
            description = "Updates an existing amenity"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200",
                    description = "Amenity updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AmenityResponse.class))),
            @ApiResponse(responseCode = "404",
                    description = "Amenity not found"),
            @ApiResponse(responseCode = "400",
                    description = "Invalid request")
    })
    public ResponseEntity<AmenityResponse> updateAmenity(
            @Parameter(description = "Amenity ID", required = true)
            @PathVariable Long id,
            @Valid
            @RequestBody AmenityRequest request) {

        return ResponseEntity.ok(
                amenityService.updateAmenity(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete Amenity",
            description = "Deletes an amenity by ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204",
                    description = "Amenity deleted successfully"),
            @ApiResponse(responseCode = "404",
                    description = "Amenity not found")
    })
    public ResponseEntity<Void> deleteAmenity(
            @Parameter(description = "Amenity ID", required = true)
            @PathVariable Long id) {

        amenityService.deleteAmenity(id);

        return ResponseEntity.noContent().build();
    }
}