package com.example.bookMyVenue.Venue.Model;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "venue_availability_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueAvailabilityRules {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;

    private DayOfWeek weekStartDay;
    private DayOfWeek weekEndDay;
    private Integer minDuration;
    private LocalTime venueOpeningTime;
    private LocalTime VenueClosingTime;
    private Integer bookBefore;
    private boolean isCurrentlyActive;
}
