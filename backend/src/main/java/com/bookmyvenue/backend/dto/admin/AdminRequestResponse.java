package com.bookmyvenue.backend.dto.admin;

import com.bookmyvenue.backend.enums.VenueStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminRequestResponse {

    private Long venueId;

    private String venueName;

    private Long ownerId;

    private String ownerName;

    private String requestType;

    private VenueStatus status;

    private LocalDateTime requestDate;

    private String approvalRemarks;
}