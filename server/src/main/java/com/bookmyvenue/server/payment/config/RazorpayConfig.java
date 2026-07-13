package com.bookmyvenue.server.payment.config;

import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RazorpayConfig {

    private final RazorpayProperties razorpayProperties;

    @Bean
    public RazorpayClient razorpayClient() throws Exception {

        return new RazorpayClient(
                razorpayProperties.getKeyId(),
                razorpayProperties.getKeySecret()
        );
    }
}