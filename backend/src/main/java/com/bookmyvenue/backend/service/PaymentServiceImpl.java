package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.payment.PaymentRequestDTO;
import com.bookmyvenue.backend.dto.payment.PaymentResponseDTO;
import com.bookmyvenue.backend.dto.payment.PaymentUpdateDTO;
import com.bookmyvenue.backend.entity.Booking;
import com.bookmyvenue.backend.entity.Payment;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.mapper.PaymentMapper;
import com.bookmyvenue.backend.repository.BookingRepository;
import com.bookmyvenue.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final PaymentMapper paymentMapper;

    @Override
    public PaymentResponseDTO createPayment(PaymentRequestDTO request) {

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        Payment payment = paymentMapper.toEntity(request, booking);

        return paymentMapper.toDto(paymentRepository.save(payment));
    }

    @Override
    public PaymentResponseDTO getPaymentById(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        return paymentMapper.toDto(payment);
    }

    @Override
    public List<PaymentResponseDTO> getPaymentsByBookingId(Long bookingId) {

        return paymentRepository.findByBooking_BookingId(bookingId)
                .stream()
                .map(paymentMapper::toDto)
                .toList();
    }

    @Override
    public PaymentResponseDTO updatePayment(Long paymentId, PaymentUpdateDTO request) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (request.getPaymentStatus() != null) {
            payment.setPaymentStatus(request.getPaymentStatus());
        }

        if (request.getRefundStatus() != null) {
            payment.setRefundStatus(request.getRefundStatus());
        }

        if (request.getRazorPaymentId() != null) {
            payment.setRazorPaymentId(request.getRazorPaymentId());
        }

        return paymentMapper.toDto(paymentRepository.save(payment));
    }

    @Override
    public void deletePayment(Long paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            throw new ResourceNotFoundException("Payment not found");
        }
        paymentRepository.deleteById(paymentId);
    }
}