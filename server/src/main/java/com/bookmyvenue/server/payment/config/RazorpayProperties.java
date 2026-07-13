package com.bookmyvenue.server.payment.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.razorpay")
public class RazorpayProperties {

    private String keyId;
    private String keySecret;
}