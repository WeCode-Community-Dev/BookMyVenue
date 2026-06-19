package com.bookmyvenue.backend.entity;
import com.bookmyvenue.backend.enums.PaymentStatus;
import com.bookmyvenue.backend.enums.PaymentType;
import com.bookmyvenue.backend.enums.RefundStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(name="payment_type",nullable = false,length = 30)
    private PaymentType paymentType;


    @Column(name = "total_amount",nullable = false,precision = 12,scale=2)
    private BigDecimal totalAmount;

    @Column(name = "advance_amount",nullable = true,precision = 12,scale=2)
    private BigDecimal advanceAmount;

    @Column(name = "remaining_amount",nullable = false,precision = 12,scale=2)
    private BigDecimal remainingAmount;

    @Column(name = "paymentDueDate")
    private LocalDateTime paymentDueDate;


    @Column(name = "refund_amount",precision = 12,scale=2)
    private BigDecimal refundAmount=BigDecimal.ZERO;


    @Enumerated(EnumType.STRING)
    @Column(name="payment_status",nullable = false,length = 30)
    private PaymentStatus paymentStatus =PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name="refund_status",nullable = false,length = 30)
    private RefundStatus refundStatus =RefundStatus.REFUND_PENDING;

    @Column(name = "razorpay_order_id",unique = true,length = 100)
    private String razorOrderId;

    @Column(name = "razor_payment_id",length = 50)
    private String razorPaymentId;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

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

        if(this.refundAmount==null)
        {
            this.refundAmount=BigDecimal.ZERO;
        }

        if(this.paymentStatus==null)
        {
            this.paymentStatus=PaymentStatus.PENDING;
        }
    }
    @PreUpdate
    protected void preUpdate() {
        updatedAt = LocalDateTime.now();
    }






}
