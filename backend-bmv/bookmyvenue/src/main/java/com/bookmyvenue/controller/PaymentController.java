package com.bookmyvenue.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookmyvenue.dto.BookingResponse;
import com.bookmyvenue.dto.PaymentIntentResponse;
import com.bookmyvenue.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent/{bookingId}")
    public ResponseEntity<PaymentIntentResponse> createIntent(
            @PathVariable Integer bookingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(paymentService.createPaymentIntent(bookingId));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
    @PostMapping("/confirm")
    public ResponseEntity<BookingResponse> confirmPayment(
            @RequestParam Integer bookingId,
            @RequestParam String paymentIntentId) {
        try {
            return ResponseEntity.ok(paymentService.confirmPayment(bookingId, paymentIntentId));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}