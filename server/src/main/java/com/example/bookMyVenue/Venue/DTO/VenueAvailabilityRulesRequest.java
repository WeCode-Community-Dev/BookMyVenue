package com.example.bookMyVenue.Venue.DTO;

import com.example.bookMyVenue.Venue.Model.Venue;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.Valid;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueAvailabilityRulesRequest {

    private Long venueId;
    private DayOfWeek weekStartDay = DayOfWeek.SUNDAY;
    private DayOfWeek weekEndDay = DayOfWeek.SATURDAY;
    private Integer minDuration = 1;
    private LocalTime venueOpeningTime =LocalTime.of(10,0,0);
    private LocalTime VenueClosingTime =LocalTime.of(22,0,0);//later we can modify it through admin if needed
    private Integer bookBefore = 5;
    private boolean isCurrentlyActive;

}
