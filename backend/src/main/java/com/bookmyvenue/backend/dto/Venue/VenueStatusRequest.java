package com.bookmyvenue.backend.dto.Venue;

import com.bookmyvenue.backend.enums.VenueStatus;
import lombok.Data;

@Data
public class VenueStatusRequest {
    private VenueStatus status;
}
