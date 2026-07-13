package com.bookmyvenue.server.verification.mail.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.brevo")
public class BrevoProperties {

    private String apiKey;

    private String senderEmail;

    private String senderName;
}