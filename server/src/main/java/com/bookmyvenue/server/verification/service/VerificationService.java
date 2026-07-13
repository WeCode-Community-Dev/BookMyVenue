package com.bookmyvenue.server.verification.service;

public interface VerificationService {

    void sendEmailVerificationOtp(String email);

    void verifyEmail(String email, String otp);


}