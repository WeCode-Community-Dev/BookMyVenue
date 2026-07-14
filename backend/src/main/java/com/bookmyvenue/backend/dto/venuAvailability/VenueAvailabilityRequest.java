package com.bookmyvenue.backend.dto.venuAvailability;

import com.bookmyvenue.backend.enums.AvailabilityStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class VenueAvailabilityRequest {

    private Long venueId;

    private LocalDate availableDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private AvailabilityStatus availabilityStatus;

    private String reason;

    private Long createdBy;
}