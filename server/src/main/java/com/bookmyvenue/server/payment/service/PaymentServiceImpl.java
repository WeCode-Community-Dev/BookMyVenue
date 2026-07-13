package com.bookmyvenue.server.payment.service;

import com.bookmyvenue.server.booking.entity.Booking;
import com.bookmyvenue.server.booking.enums.BookingStatus;
import com.bookmyvenue.server.booking.repository.BookingRepository;
import com.bookmyvenue.server.common.exception.BusinessException;
import com.bookmyvenue.server.common.exception.ErrorCode;
import com.bookmyvenue.server.payment.config.RazorpayProperties;
import com.bookmyvenue.server.payment.dto.request.VerifyPaymentRequest;
import com.bookmyvenue.server.payment.dto.response.PaymentResponse;
import com.bookmyvenue.server.payment.enums.PaymentType;
import com.bookmyvenue.server.payment.enums.PaymentStatus;
import com.bookmyvenue.server.payment.repository.PaymentRepository;
import com.razorpay.Order;
import com.bookmyvenue.server.payment.entity.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final RazorpayClient razorpayClient;
    private final RazorpayProperties razorpayProperties;

    @Override
    public PaymentResponse createPayment(Long bookingId) throws RazorpayException {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                new BusinessException(ErrorCode.BOOKING_NOT_FOUND));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BusinessException(ErrorCode.INVALID_BOOKING_STATUS);
        }

        paymentRepository.findByBookingId(bookingId)
                .ifPresent(payment -> {
            throw new BusinessException(ErrorCode.PAYMENT_ALREADY_EXISTS);
        });
        JSONObject options = new JSONObject();
        options.put("amount", booking.getTotalAmount()
                        .multiply(BigDecimal.valueOf(100))
                        .intValue());

        options.put("currency", "INR");
        options.put("receipt", "booking_" + booking.getId());
        Order razorpayOrder = razorpayClient.orders.create(options);

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalAmount())
                .paymentType(PaymentType.ADVANCE)
                .status(PaymentStatus.PENDING)
                .razorpayOrderId(
                        razorpayOrder.get("id")
                                .toString()
                )
                .build();

        payment = paymentRepository.save(payment);
        return new PaymentResponse(
                payment.getId(),
                booking.getId(),
                payment.getRazorpayOrderId(),
                payment.getAmount(),
                payment.getStatus()
        );
    }
    @Override
    public void verifyPayment(VerifyPaymentRequest request) throws RazorpayException {

        Payment payment = paymentRepository
                .findByRazorpayOrderId(request.razorpayOrderId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.PAYMENT_NOT_FOUND)
                );

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return;
        }


        boolean isValid = Utils.verifySignature(
                request.razorpayOrderId()
                        + "|"
                        + request.razorpayPaymentId(),
                request.razorpaySignature(),
                razorpayProperties.getKeySecret()
        );

        if (!isValid) {
            throw new BusinessException(ErrorCode.INVALID_PAYMENT_SIGNATURE);
        }

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setRazorpayPaymentId(request.razorpayPaymentId());
        payment.setRazorpaySignature(request.razorpaySignature());
        payment.setPaidAt(LocalDateTime.now());

        Booking booking = payment.getBooking();

        booking.setStatus(BookingStatus.CONFIRMED);

        paymentRepository.save(payment);
    }
}