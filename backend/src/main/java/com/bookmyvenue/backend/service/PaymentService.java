package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.payment.PaymentRequestDTO;
import com.bookmyvenue.backend.dto.payment.PaymentResponseDTO;
import com.bookmyvenue.backend.dto.payment.PaymentUpdateDTO;

import java.util.List;

public interface PaymentService {

    PaymentResponseDTO createPayment(PaymentRequestDTO request);

    PaymentResponseDTO getPaymentById(Long paymentId);

    List<PaymentResponseDTO> getPaymentsByBookingId(Long bookingId);

    PaymentResponseDTO updatePayment(Long paymentId, PaymentUpdateDTO request);

    void deletePayment(Long paymentId);
}