package com.bookmyvenue.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "venues")
public class Venues {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "venue_name", nullable = false, length = 255)
    private String venueName;

    @Enumerated(EnumType.STRING)
    @Column(name = "venue_type", nullable = false)
    private VenueType venueType;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "venue_description", length = 1000)
    private String venueDescription;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Integer price;

    @Enumerated(EnumType.STRING)
    @Column(name = "parking_available", nullable = false)
    private ParkingAvailability parkingAvailable;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "terms_accepted", nullable = false)
    private Boolean termsAccepted;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VenueStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = VenueStatus.PENDING;
        }

        if (this.termsAccepted == null) {
            this.termsAccepted = false;
        }
    }

    public enum VenueType {
        BANQUET_HALL,
        OUTDOOR_GARDEN,
        CONFERENCE_ROOM,
        WEDDING_RECEPTION_HALL
    }

    public enum ParkingAvailability {
        YES,
        NO
    }

    public enum VenueStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}
