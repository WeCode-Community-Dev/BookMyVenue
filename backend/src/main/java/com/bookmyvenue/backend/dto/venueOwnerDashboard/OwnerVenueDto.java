package com.bookmyvenue.backend.dto.venueOwnerDashboard;

import com.bookmyvenue.backend.enums.VenueStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OwnerVenueDto {

    private Long venueId;

    private String venueName;

    private String city;

    private VenueStatus status;

    private Long bookingCount;
}