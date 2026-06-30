package com.bookmyvenue.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookmyvenue.dto.BookingResponse;
import com.bookmyvenue.dto.PaymentIntentResponse;
import com.bookmyvenue.model.Booking;
import com.bookmyvenue.repository.BookingRepository;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final BookingRepository bookingRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.publishable.key}")
    private String stripePublishableKey;

    //Create Payment Intent 
    // Called when user clicks "Proceed to Pay"
    // Stripe needs amount in smallest currency unit — paise for INR
    public PaymentIntentResponse createPaymentIntent(Integer bookingId) throws Exception {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        if (booking.getBookingStatus() != Booking.BookingStatus.APPROVED) {
            throw new RuntimeException("Booking must be APPROVED before payment");
        }

        if (booking.getPaymentStatus() == Booking.PaymentStatus.PAID) {
            throw new RuntimeException("This booking is already paid");
        }

        Stripe.apiKey = stripeSecretKey;

        Long amountInPaise = (long) booking.getVenue().getPrice() * 100;

        // Create metadata so we can identify this booking on webhook
        Map<String, String> metadata = new HashMap<>();
        metadata.put("bookingId", String.valueOf(bookingId));
        metadata.put("venueName", booking.getVenue().getVenueName());

        // Create Stripe PaymentIntent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInPaise)
                .setCurrency("inr")
                .putAllMetadata(metadata)
                .setDescription("BookMyVenue — " + booking.getVenue().getVenueName()
                        + " on " + booking.getBookingDate())
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        log.info("PaymentIntent created: {} for booking id={}", intent.getId(), bookingId);

        return new PaymentIntentResponse(
                intent.getClientSecret(),
                stripePublishableKey,       
                amountInPaise,
                "inr",
                bookingId
        );
    }

    // Confirm payment success 
    // Called after Stripe confirms payment on frontend
    @Transactional
    public BookingResponse confirmPayment(Integer bookingId, String paymentIntentId) throws Exception {

        Stripe.apiKey = stripeSecretKey;
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);

        if (!"succeeded".equals(intent.getStatus())) {
            throw new RuntimeException("Payment not completed. Status: " + intent.getStatus());
        }

        // Update in DB
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setPaymentStatus(Booking.PaymentStatus.PAID);
        booking.setPaymentOn(LocalDateTime.now());
        booking.setPaymentIntentId(paymentIntentId);
        bookingRepository.save(booking);

        log.info("Payment confirmed for booking id={} paymentIntent={}", bookingId, paymentIntentId);

        return BookingResponse.from(booking);
    }
}