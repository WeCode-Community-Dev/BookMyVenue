package com.bookmyvenue.server.verification.mail.service;

public interface MailService {


    void sendVerificationOtp(String email, String otp);


    void sendPasswordResetOtp(String email, String otp);

}
