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
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "booking_cancellations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BookingCancellation {
   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(name = "cancelled_by", nullable = false)
    private CancelledBy cancelledBy = CancelledBy.USER;

    @Column(nullable = false, length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CancellationStatus status = CancellationStatus.PENDING;

    @Column(name = "owner_response", length = 500)
    private String ownerResponse;

    @Column(name = "created_on", updatable = false)
    private LocalDateTime createdOn;

    @Column(name = "reviewed_on")
    private LocalDateTime reviewedOn;

    @PrePersist
    protected void onCreate() {
        this.createdOn = LocalDateTime.now();
    }

    public enum CancelledBy {
        USER, OWNER, ADMIN
    }

    public enum CancellationStatus {
        PENDING, APPROVED, REJECTED
    } 
}
