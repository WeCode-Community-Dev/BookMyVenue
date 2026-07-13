
package com.bookmyvenue.server.payment.dto.request;

public record VerifyPaymentRequest(

        String razorpayOrderId,
        String razorpayPaymentId,
        String razorpaySignature
) {
}