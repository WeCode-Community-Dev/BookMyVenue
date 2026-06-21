package com.bookmyvenue.backend.dto.payment;

import com.bookmyvenue.backend.enums.PaymentStatus;
import com.bookmyvenue.backend.enums.RefundStatus;
import lombok.Data;

@Data
public class PaymentUpdateDTO {

    private PaymentStatus paymentStatus;

    private RefundStatus refundStatus;

    private String razorPaymentId;
}