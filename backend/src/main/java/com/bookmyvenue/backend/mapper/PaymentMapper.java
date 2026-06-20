package com.bookmyvenue.backend.mapper;

import com.bookmyvenue.backend.dto.payment.PaymentRequestDTO;
import com.bookmyvenue.backend.dto.payment.PaymentResponseDTO;
import com.bookmyvenue.backend.entity.Booking;
import com.bookmyvenue.backend.entity.Payment;
import com.bookmyvenue.backend.enums.PaymentStatus;
import com.bookmyvenue.backend.enums.RefundStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PaymentMapper {

    public Payment toEntity(PaymentRequestDTO dto, Booking booking) {
        return Payment.builder()
                .booking(booking)
                .paymentType(dto.getPaymentType())
                .amount(dto.getAmount())
                .paymentDueDate(dto.getPaymentDueDate())
                .paymentStatus(PaymentStatus.PENDING)
                .refundStatus(RefundStatus.REFUND_PENDING)
                .refundAmount(BigDecimal.ZERO)
                .build();
    }

    public PaymentResponseDTO toDto(Payment payment) {
        return PaymentResponseDTO.builder()
                .paymentId(payment.getPaymentId())
                .bookingId(payment.getBooking().getBookingId())
                .paymentType(payment.getPaymentType())
                .amount(payment.getAmount())
                .refundAmount(payment.getRefundAmount())
                .paymentStatus(payment.getPaymentStatus())
                .refundStatus(payment.getRefundStatus())
                .razorOrderId(payment.getRazorOrderId())
                .razorPaymentId(payment.getRazorPaymentId())
                .paidAt(payment.getPaidAt())
                .build();
    }
}