package com.example.bookMyVenue.Venue.Model;

import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_venue_action_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminVenueActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Enumerated(EnumType.STRING)
    private VenueVerificationStatus action;

    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private User admin;

    private LocalDateTime actionDate;

    @PrePersist
    public void prePersist() {
        this.actionDate = LocalDateTime.now();
    }
}
