package com.example.bookMyVenue.Venue.DTO;

import com.example.bookMyVenue.Venue.Enums.DurationType;
import com.example.bookMyVenue.Venue.Model.Venue;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueAvailabilityRulesRequest {

    @NotNull
    private DurationType durationType;

    private Integer durationHour;

    @NotNull
    private DayOfWeek weekStartDay;
    @NotNull
    private DayOfWeek weekEndDay;

    @NotNull
    private LocalTime operatingStartTime;
    @NotNull
    private LocalTime operatingEndTime;

    private BigDecimal weekdayDayRate;
    private BigDecimal weekdayNightRate;
    private BigDecimal weekendDayRate;
    private BigDecimal weekendNightRate;
}

