package com.bookmyvenue.server.verification.service;

import com.bookmyvenue.server.verification.util.RedisKeys;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpRedisServiceImpl implements OtpRedisService {

    private static final Duration OTP_EXPIRY = Duration.ofMinutes(5);
    private final StringRedisTemplate redisTemplate;

    @Override
    public void saveOtp(String key, String otp) {
        redisTemplate.opsForValue()
                .set(key, otp, OTP_EXPIRY);
    }

    @Override
    public String getOtp(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void deleteOtp(String key) {
        redisTemplate.delete(key);
    }


}