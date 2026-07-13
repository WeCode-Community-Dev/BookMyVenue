package com.bookmyvenue.server.payment.service;

import com.bookmyvenue.server.payment.dto.request.VerifyPaymentRequest;
import com.bookmyvenue.server.payment.dto.response.PaymentResponse;
import com.razorpay.RazorpayException;

public interface PaymentService {

    PaymentResponse createPayment(Long bookingId) throws RazorpayException;

    void verifyPayment(VerifyPaymentRequest request) throws RazorpayException;
}