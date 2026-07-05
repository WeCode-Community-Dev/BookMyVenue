package com.example.bookMyVenue.Venue.DTO;

import com.example.bookMyVenue.Enums.VenueExceptionType;
import com.example.bookMyVenue.Venue.Enums.VenueExceptionActiveStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class VenueAvailabilityExceptionResponse {
    private Long id;
    private Long venueId;
    private LocalDate exceptionDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private VenueExceptionType exceptionType;
    private String reason;
    private VenueExceptionActiveStatus status;
}
