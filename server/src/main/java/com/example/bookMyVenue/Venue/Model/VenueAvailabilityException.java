package com.example.bookMyVenue.Venue.Model;

import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueExceptionType;
import com.example.bookMyVenue.Enums.VenueExceptionstatus;
import com.example.bookMyVenue.Venue.Enums.VenueExceptionActiveStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "venue_availability_exceptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueAvailabilityException {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @NotNull
    private LocalDate exceptionDate;

    private LocalTime startTime;
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    private VenueExceptionType exceptionType;

    private String reason;

    @Enumerated(EnumType.STRING)
    private VenueExceptionActiveStatus status;
    ;


    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = VenueExceptionActiveStatus.ACTIVE;
        }
    }
}

