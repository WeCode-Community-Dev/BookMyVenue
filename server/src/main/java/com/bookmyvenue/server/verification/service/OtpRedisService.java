package com.bookmyvenue.server.verification.service;

public interface OtpRedisService {

    void saveOtp(String key, String otp);

    String getOtp(String key);

    void deleteOtp(String key);




}