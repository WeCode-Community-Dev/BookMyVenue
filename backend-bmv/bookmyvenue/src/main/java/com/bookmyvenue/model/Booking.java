package com.bookmyvenue.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Many bookings can belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many bookings can belong to one venue
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venues venue;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false)
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.UNPAID;

    @Column(name = "owner_comments", length = 500)
    private String ownerComments;

    @Column(name = "reviewed_on")
    private LocalDateTime reviewedOn;

    @Column(name = "booked_on", updatable = false)
    private LocalDateTime bookedOn;

    @Column(name = "payment_on")
    private LocalDateTime paymentOn;

    // Version column — JPA uses this automatically for optimistic locking
    // If two requests try to update the same booking at the same time,
    // the second one will fail with OptimisticLockException instead of
    // silently overwriting the first
    @Version
    @Column(nullable = false)
    private Integer version = 0;
    
    @Column(name= "payment_intent_id", length=100)
    private String paymentIntentId;

    @PrePersist
    protected void onCreate() {
        this.bookedOn        = LocalDateTime.now();
        this.bookingStatus   = BookingStatus.PENDING;
        this.paymentStatus   = PaymentStatus.UNPAID;
    }

    public enum BookingStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }

    public enum PaymentStatus {
        UNPAID, PAID, REFUNDED
    }
}