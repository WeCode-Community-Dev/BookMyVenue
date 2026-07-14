package com.bookmyvenue.backend.dto.venueAmenity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AmenityRequest {

    private String amenityName;
    private String description;
    private Boolean isActive;
}