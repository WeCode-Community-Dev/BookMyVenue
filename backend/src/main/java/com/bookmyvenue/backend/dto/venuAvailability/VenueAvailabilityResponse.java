package com.bookmyvenue.backend.dto.venuAvailability;

import com.bookmyvenue.backend.enums.AvailabilityStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class VenueAvailabilityResponse {

    private Long availabilityId;

    private Long venueId;

    private LocalDate availableDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private AvailabilityStatus availabilityStatus;

    private String reason;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}