package com.example.bookMyVenue.Venue.DTO;

import com.example.bookMyVenue.Enums.VenueExceptionType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class VenueAvailabilityExceptionRequest {

    @NotNull
    private LocalDate exceptionDate;
    private LocalTime startTime;
    private LocalTime endTime;
    @NotNull
    private VenueExceptionType exceptionType;

    private String reason;
}
