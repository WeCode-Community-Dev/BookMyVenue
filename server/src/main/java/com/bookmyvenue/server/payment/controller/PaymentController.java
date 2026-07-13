package com.bookmyvenue.server.payment.controller;

import com.bookmyvenue.server.payment.dto.request.VerifyPaymentRequest;
import com.bookmyvenue.server.payment.dto.response.PaymentResponse;
import com.bookmyvenue.server.payment.service.PaymentService;
import com.razorpay.RazorpayException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payments")
@Tag(name = "Payment Management")
@PreAuthorize("hasRole('USER')")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/{bookingId}")
    @Operation(summary = "Create Payment Order")
    public ResponseEntity<PaymentResponse> createPayment(@PathVariable Long bookingId) throws RazorpayException {

        return ResponseEntity.ok(
                paymentService.createPayment(bookingId));
    }


    @PostMapping("/verify")
    @Operation(summary = "Verify Payment")
    public ResponseEntity<Void> verifyPayment(@RequestBody VerifyPaymentRequest request) throws RazorpayException {

        paymentService.verifyPayment(request);
        return ResponseEntity.ok().build();
    }
}