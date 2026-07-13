package com.bookmyvenue.server.payment.dto.response;

import com.bookmyvenue.server.payment.enums.PaymentStatus;

import java.math.BigDecimal;

public record PaymentResponse(
        Long paymentId,
        Long bookingId,
        String razorpayOrderId,
        BigDecimal amount,
        PaymentStatus status
) {
}