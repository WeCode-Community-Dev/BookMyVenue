package com.example.bookMyVenue.Venue.Model;

import com.example.bookMyVenue.Venue.Enums.DurationType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;


@Table(name = "venue_availability_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class VenueAvailabilityRules {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;

    private DayOfWeek weekStartDay;

    private DayOfWeek weekEndDay;

    @Enumerated(EnumType.STRING)
    private DurationType durationType;

    private Integer durationHour;

    private LocalTime operatingStartTime;

    private LocalTime nightStartTime;

    private LocalTime operatingEndTime;

    private BigDecimal weekdayDayRate;

    private BigDecimal weekdayNightRate;

    private BigDecimal weekendDayRate;

    private BigDecimal weekendNightRate;

    private LocalDate effectiveFrom;
}
