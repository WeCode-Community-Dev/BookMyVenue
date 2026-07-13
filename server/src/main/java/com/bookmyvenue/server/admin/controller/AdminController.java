package com.bookmyvenue.server.admin.controller;

import com.bookmyvenue.server.admin.dto.response.AdminUserResponse;
import com.bookmyvenue.server.admin.dto.response.AdminVenueResponse;
import com.bookmyvenue.server.admin.dto.response.DashboardResponse;
import com.bookmyvenue.server.admin.service.AdminService;
import com.bookmyvenue.server.venue.dto.response.VenueResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Validated
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "Get admin dashboard", description = "Returns platform statistics including users, vendors, venues and bookings.")
    @ApiResponse(responseCode = "200", description = "Dashboard retrieved successfully")
    @GetMapping("/dashboard")
    public DashboardResponse getDashboard() {
        return adminService.getDashboard();
    }


    @Operation(summary = "Get pending venues", description = "Returns a paginated list of venues awaiting admin approval.")
    @ApiResponse(responseCode = "200", description = "Pending venues retrieved successfully")
    @GetMapping("/venues/pending")
    public Page<AdminVenueResponse> getPendingVenues(
            @Parameter(description = "Page number", example = "0")
            @RequestParam(defaultValue = "0")
            @Min(0) int page,
            @Parameter(description = "Page size", example = "10")
            @RequestParam(defaultValue = "10")
            @Min(1)
            @Max(100) int size)
    {
        return adminService.getPendingVenues(page, size);
    }



    @Operation(summary = "Get all venues", description = "Returns a paginated list of all venues regardless of status.")
    @ApiResponse(responseCode = "200", description = "Venues retrieved successfully")
    @GetMapping("/venues")
    public Page<AdminVenueResponse> getAllVenues(
            @Parameter(description = "Page number", example = "0")
            @RequestParam(defaultValue = "0")
            @Min(0) int page,

            @Parameter(description = "Page size", example = "10")
            @RequestParam(defaultValue = "10")
            @Min(1)
            @Max(100) int size
    ) {
        return adminService.getAllVenues(page, size);
    }


    @Operation(summary = "Get venue details", description = "Returns complete venue information for administrative review.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Venue retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Venue not found")
    })
    @GetMapping("/venues/{venueId}")
    public VenueResponse getVenue(
            @PathVariable Long venueId
    ) {
        return adminService.getVenue(venueId);
    }



    @Operation(summary = "Approve venue", description = "Approves a pending venue and makes it visible to customers.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Venue approved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid venue status"),
            @ApiResponse(responseCode = "404", description = "Venue not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PatchMapping("/venues/{venueId}/approve")
    public void approveVenue(@PathVariable Long venueId) {
        adminService.approveVenue(venueId);
    }



    @Operation(summary = "Reject venue", description = "Rejects a pending venue.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Venue rejected successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid venue status"),
            @ApiResponse(responseCode = "404", description = "Venue not found"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @PatchMapping("/venues/{venueId}/reject")
    public void rejectVenue(@PathVariable Long venueId) {
        adminService.rejectVenue(venueId);
    }


    @Operation(summary = "Get all users", description = "Returns a paginated list of all registered users.")
    @ApiResponses({@ApiResponse(responseCode = "200",description = "Users retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/users")
    public Page<AdminUserResponse> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getUsers(page, size);
    }


    @Operation(summary = "Get all vendors", description = "Returns a paginated list of all registered venue vendors.")
    @ApiResponses({@ApiResponse(responseCode = "200", description = "Vendors retrieved successfully"),
            @ApiResponse(responseCode = "403", description = "Access denied")
    })
    @GetMapping("/vendors")
    public Page<AdminUserResponse> getVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getVendors(page, size);
    }



}