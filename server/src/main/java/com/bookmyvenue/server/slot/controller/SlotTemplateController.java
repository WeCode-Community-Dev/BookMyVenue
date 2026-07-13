package com.bookmyvenue.server.slot.controller;

import com.bookmyvenue.server.slot.dto.request.CreateSlotTemplateRequest;
import com.bookmyvenue.server.slot.dto.response.SlotTemplateResponse;
import com.bookmyvenue.server.slot.service.SlotTemplateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Slot Management")
@PreAuthorize("hasRole('VENDOR')")
@RequestMapping("/api/v1/venues")
@RequiredArgsConstructor
public class SlotTemplateController {

    private final SlotTemplateService slotTemplateService;

    /**
     * Creates a new slot template for a venue.
     */
    @PostMapping("/{venueId}/slots")
    @Operation(summary = "Create Slot Template")
    public ResponseEntity<SlotTemplateResponse> createTemplate(
            @PathVariable Long venueId,
            @Valid @RequestBody CreateSlotTemplateRequest request
    ) {

        SlotTemplateResponse response =
                slotTemplateService.createTemplate(
                        venueId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    /**
     * Returns all slot templates configured for a venue.
     */
    @GetMapping("/{venueId}/slots")
    @Operation(summary = "Get Slot Templates")
    public ResponseEntity<List<SlotTemplateResponse>> getVenueTemplates(
            @PathVariable Long venueId
    ) {

        return ResponseEntity.ok(
                slotTemplateService.getVenueTemplates(
                        venueId
                )
        );
    }

    /**
     * Deletes a slot template.
     */

    @DeleteMapping("/slots/{templateId}")
    @Operation(summary = "Delete Slot Template")
    public ResponseEntity<Void> deleteTemplate(
            @PathVariable Long templateId
    ) {

        slotTemplateService.deleteTemplate(templateId);

        return ResponseEntity.noContent().build();
    }
}