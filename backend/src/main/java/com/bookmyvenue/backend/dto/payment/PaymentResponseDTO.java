package com.bookmyvenue.backend.dto.payment;

import com.bookmyvenue.backend.enums.PaymentStatus;
import com.bookmyvenue.backend.enums.PaymentType;
import com.bookmyvenue.backend.enums.RefundStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponseDTO {

    private Long paymentId;

    private Long bookingId;

    private PaymentType paymentType;

    private BigDecimal amount;

    private BigDecimal refundAmount;

    private PaymentStatus paymentStatus;

    private RefundStatus refundStatus;

    private String razorOrderId;

    private String razorPaymentId;

    private LocalDateTime paidAt;
}
