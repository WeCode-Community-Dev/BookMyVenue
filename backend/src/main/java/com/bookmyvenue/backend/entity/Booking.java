package com.bookmyvenue.backend.entity;
import com.bookmyvenue.backend.enums.BookingStatus;
import com.bookmyvenue.backend.enums.BookingType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "booking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users user;

    @Enumerated(EnumType.STRING)
    @Column(name="bookingType",nullable = false,length = 30)
    private BookingType bookingType;

    @Column(name = "venu_date",nullable = false)
    private LocalDate eventDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "guest_count",nullable = false)
    private Integer guestCount;


    @Enumerated(EnumType.STRING)
    @Column(name="bookingStatus",nullable = false,length = 30)
    private BookingStatus bookingStatus =BookingStatus.PENDING_PAYMENT;


    @Column(name = "cancellation_reason",nullable = true,length = 50)
    private String cancellationReason;

    @Column(name = "cancellation_at", nullable = true, updatable = false)
    private LocalDateTime cancellationAt;

    @Column(name = "cancelled_by")
    private String cancelledBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by", updatable = false)
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @PrePersist
    protected void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
