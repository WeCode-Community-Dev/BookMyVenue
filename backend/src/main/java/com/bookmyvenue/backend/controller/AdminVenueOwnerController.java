package com.bookmyvenue.backend.controller;

import com.bookmyvenue.backend.dto.admin.AdminVenueOwnerResponse;
import com.bookmyvenue.backend.dto.admin.AdminVenueOwnerSearchRequest;
import com.bookmyvenue.backend.service.AdminVenueOwnerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/venue-owners")
@RequiredArgsConstructor
@Tag(name = "Admin Venue Owner Management")
public class AdminVenueOwnerController {

    private final
    AdminVenueOwnerService service;

    @GetMapping
    public ResponseEntity<List<AdminVenueOwnerResponse>>
    getAllVenueOwners() {

        return ResponseEntity.ok(
                service.getAllVenueOwners());
    }

    @GetMapping("/{ownerId}")
    public ResponseEntity<AdminVenueOwnerResponse>
    getVenueOwnerById(
            @PathVariable Long ownerId) {

        return ResponseEntity.ok(
                service.getVenueOwnerById(ownerId));
    }

    @PostMapping("/search")
    public ResponseEntity<List<AdminVenueOwnerResponse>>
    searchVenueOwners(
            @RequestBody
            AdminVenueOwnerSearchRequest request) {

        return ResponseEntity.ok(
                service.searchVenueOwners(request));
    }

    @PatchMapping("/{ownerId}/verify")
    public ResponseEntity<AdminVenueOwnerResponse>
    verifyVenueOwner(
            @PathVariable Long ownerId) {

        return ResponseEntity.ok(
                service.verifyVenueOwner(ownerId));
    }

    @PatchMapping("/{ownerId}/suspend")
    public ResponseEntity<AdminVenueOwnerResponse>
    suspendVenueOwner(
            @PathVariable Long ownerId) {

        return ResponseEntity.ok(
                service.suspendVenueOwner(ownerId));
    }
}