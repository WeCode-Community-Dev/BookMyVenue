package com.bookmyvenue.backend.entity;
import com.bookmyvenue.backend.enums.BookingStatus;
import com.bookmyvenue.backend.enums.BookingType;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

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
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_type", nullable = false, length = 30)
    private BookingType bookingType;

    @Column(name = "venue_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "guest_count", nullable = false)
    private Integer guestCount;

    // Financial Summary

    @Column(name = "total_amount",
            nullable = false,
            precision = 12,
            scale = 2)
    private BigDecimal totalAmount;

    @Builder.Default
    @Column(name = "paid_amount",
            nullable = false,
            precision = 12,
            scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "balance_amount",
            nullable = false,
            precision = 12,
            scale = 2)
    private BigDecimal balanceAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status",
            nullable = false,
            length = 30)
    private BookingStatus bookingStatus =
            BookingStatus.PENDING_PAYMENT;

    @JsonManagedReference
    @Builder.Default
    @OneToMany(
            mappedBy = "booking",
            cascade = CascadeType.ALL,
            orphanRemoval = false)
    private List<Payment> payments =
            new ArrayList<>();

    @Column(name = "cancellation_reason", length = 500)
    private String cancellationReason;

    @Column(name = "cancellation_at")
    private LocalDateTime cancellationAt;

    @Column(name = "cancelled_by", length = 100)
    private String cancelledBy;

    @Column(name = "created_at",
            nullable = false,
            updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by",
            updatable = false)
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    public void addPayment(Payment payment) {
        payments.add(payment);
        payment.setBooking(this);
    }

    public void removePayment(Payment payment) {
        payments.remove(payment);
        payment.setBooking(null);
    }

    public void updatePaymentSummary() {

        BigDecimal totalPaid = payments.stream()
                .filter(payment ->
                        payment.getPaymentStatus().name()
                                .equals("SUCCESS"))
                .map(Payment::getAmount)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add);

        this.paidAmount = totalPaid;
        this.balanceAmount =
                this.totalAmount.subtract(totalPaid);
    }

    @PrePersist
    protected void prePersist() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (paidAmount == null) {
            paidAmount = BigDecimal.ZERO;
        }

        if (totalAmount != null) {
            balanceAmount =
                    totalAmount.subtract(paidAmount);
        }

        if (bookingStatus == null) {
            bookingStatus =
                    BookingStatus.PENDING_PAYMENT;
        }
    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
