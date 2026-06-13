package com.bookmyvenue.backend.dto.adminDashboard;

import com.bookmyvenue.backend.enums.VenueStatus;
import lombok.Data;

@Data
public class AdminRequestSearchRequest {

    private String venueName;

    private VenueStatus status;

    private Long ownerId;
}