package com.example.bookMyVenue.Venue.Model;

import com.example.bookMyVenue.Enums.Exceptionstatus;
import com.example.bookMyVenue.Enums.VenueExceptionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "venue_availability_exceptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueAvailabilityException {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;

    private LocalDate exception_date;
    private LocalTime start_time;
    private LocalTime end_time;
    @Enumerated(EnumType.STRING)
    private VenueExceptionType venueExceptionType;

    private String reason;

    @Enumerated(EnumType.STRING)
    private Exceptionstatus exceptionstatus;
}
