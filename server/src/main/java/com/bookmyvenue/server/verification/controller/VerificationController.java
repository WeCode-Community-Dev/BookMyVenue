package com.bookmyvenue.server.verification.controller;

import com.bookmyvenue.server.verification.dto.request.EmailRequest;
import com.bookmyvenue.server.verification.dto.request.VerifyEmailRequest;
import com.bookmyvenue.server.verification.service.VerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @Operation(summary = "Verify email", description = "Verifies the user's email using the OTP sent to their email address.")
    @ApiResponse(responseCode = "200", description = "Email verified successfully")
    @PostMapping("/verify-email")
    public void verifyEmail(@Valid @RequestBody VerifyEmailRequest request)
    {
        verificationService.verifyEmail(request.getEmail(), request.getOtp());
    }

    @Operation(summary = "Resend verification email", description = "Generates a new OTP and sends it to the user's registered email.")
    @ApiResponse(responseCode = "200", description = "Verification email sent successfully")
    @PostMapping("/resend-verification")
    public void resendVerification(@Valid @RequestBody EmailRequest request)
    {
        verificationService.sendEmailVerificationOtp(request.getEmail());
    }
}