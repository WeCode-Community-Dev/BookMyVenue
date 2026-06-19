package com.bookmyvenue.backend.controller;
import com.bookmyvenue.backend.dto.admin.AdminRequestResponse;
import com.bookmyvenue.backend.dto.admin.AdminRequestSearchRequest;
import com.bookmyvenue.backend.service.AdminRequestService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/requests")
@RequiredArgsConstructor
@Tag(name = "Admin Requests")
public class AdminRequestController {

    private final
    AdminRequestService adminRequestService;

    @GetMapping
    public ResponseEntity<
            List<AdminRequestResponse>>
    getAllRequests() {

        return ResponseEntity.ok(
                adminRequestService
                        .getAllRequests());
    }

    @GetMapping("/{venueId}")
    public ResponseEntity<
            AdminRequestResponse>
    getRequestDetails(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                adminRequestService
                        .getRequestDetails(
                                venueId));
    }

    @PostMapping("/search")
    public ResponseEntity<
            List<AdminRequestResponse>>
    searchRequests(
            @RequestBody
            AdminRequestSearchRequest request) {

        return ResponseEntity.ok(
                adminRequestService
                        .searchRequests(
                                request));
    }

    @PatchMapping("/{venueId}/approve")
    public ResponseEntity<
            AdminRequestResponse>
    approveRequest(
            @PathVariable Long venueId,
            @RequestParam String remarks) {

        return ResponseEntity.ok(
                adminRequestService
                        .approveRequest(
                                venueId,
                                remarks));
    }

    @PatchMapping("/{venueId}/reject")
    public ResponseEntity<
            AdminRequestResponse>
    rejectRequest(
            @PathVariable Long venueId,
            @RequestParam String remarks) {

        return ResponseEntity.ok(
                adminRequestService
                        .rejectRequest(
                                venueId,
                                remarks));
    }
}