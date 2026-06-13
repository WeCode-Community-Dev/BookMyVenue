package com.bookmyvenue.backend.controller;

import com.bookmyvenue.backend.dto.venueDocument.VenueDocumentRequest;
import com.bookmyvenue.backend.dto.venueDocument.VenueDocumentResponse;
import com.bookmyvenue.backend.service.VenueDocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venue-documents")
@RequiredArgsConstructor
@Tag(name = "Venue Documents", description = "APIs for managing venue documents")
public class VenueDocumentController {

    private final VenueDocumentService service;

    @PostMapping
    @Operation(
            summary = "Create venue document",
            description = "Creates a new document for a venue"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Document created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = VenueDocumentResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Invalid request"),
            @ApiResponse(responseCode = "404", description = "Venue not found")
    })

    public ResponseEntity<VenueDocumentResponse> create(
            @Valid @RequestBody VenueDocumentRequest request) {

        return ResponseEntity.ok(
                service.createDocument(request)

        );
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get document by ID",
            description = "Retrieves a venue document by its ID"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Document found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = VenueDocumentResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })
    public ResponseEntity<VenueDocumentResponse> getById(
            @Parameter(description = "Document ID", required = true)
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getDocumentById(id));


    }

    @GetMapping
    @Operation(
            summary = "Get all documents",
            description = "Retrieves all venue documents"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Documents retrieved successfully"
    )
    public ResponseEntity<List<VenueDocumentResponse>> getAll() {

        return ResponseEntity.ok(service.getAllDocuments());


    }

    @GetMapping("/venue/{venueId}")
    @Operation(
            summary = "Get documents by venue",
            description = "Retrieves all documents associated with a specific venue"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Documents retrieved successfully"
            ),
            @ApiResponse(responseCode = "404", description = "Venue not found")
    })
    public ResponseEntity<List<VenueDocumentResponse>> getByVenue(
            @Parameter(description = "Venue ID", required = true)
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                service.getDocumentsByVenue(venueId));


    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Update venue document",
            description = "Updates an existing venue document"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Document updated successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = VenueDocumentResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "404", description = "Document not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    public ResponseEntity<VenueDocumentResponse> update(
            @Parameter(description = "Document ID", required = true)
            @PathVariable Long id,
            @Valid @RequestBody VenueDocumentRequest request) {

        return ResponseEntity.ok(
                service.updateDocument(id, request));
    }


    @DeleteMapping("/{id}")
    @Operation(
            summary = "Delete venue document",
            description = "Deletes a venue document by its ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Document deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Document not found")
    })

public ResponseEntity<Void> delete(
        @Parameter(description = "Document ID", required = true)
        @PathVariable Long id) {

    service.deleteDocument(id);

    return ResponseEntity.noContent().build();
}

}
