package com.example.bookMyVenue.Venue.DTO;

import com.example.bookMyVenue.Venue.Enums.DurationType;
import lombok.*;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueAvailabiltyRulesResponse {
    private Long id;
    private Long venueId;
    private DurationType durationType;
    private Integer durationHour;
    private DayOfWeek weekStartDay;
    private DayOfWeek weekEndDay;
    private LocalTime operatingStartTime;
    private LocalTime operatingEndTime;
    private BigDecimal weekdayDayRate;
    private BigDecimal weekdayNightRate;
    private BigDecimal weekendDayRate;
    private BigDecimal weekendNightRate;
    private LocalDate effectiveFrom;
    private String status;
}
