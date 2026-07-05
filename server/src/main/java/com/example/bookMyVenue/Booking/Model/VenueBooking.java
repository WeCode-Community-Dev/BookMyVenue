package com.example.bookMyVenue.Booking.Model;

import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Booking.Enums.BookingStatus;
import com.example.bookMyVenue.Venue.Enums.DurationType;
import com.example.bookMyVenue.Venue.Model.Venue;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Table(name = "venue_booking")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    private DurationType durationType; // snapshot from the rule at booking time

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // PENDING, CONFIRMED, CANCELLED, COMPLETED

    private BigDecimal appliedRate;
    private String eventPurpose;
    private LocalDateTime createdAt;

    private String paymentStatus;
    private String stripePaymentIntentId;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = BookingStatus.CONFIRMED;
        if (this.paymentStatus == null) this.paymentStatus = "NOT_INTEGRATED";
    }
}
