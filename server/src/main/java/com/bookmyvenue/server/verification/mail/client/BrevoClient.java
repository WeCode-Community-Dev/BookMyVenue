package com.bookmyvenue.server.verification.mail.client;


import com.bookmyvenue.server.verification.mail.config.BrevoProperties;
import com.bookmyvenue.server.verification.mail.dto.BrevoEmailRequest;
import com.bookmyvenue.server.verification.mail.dto.BrevoResponse;
import com.bookmyvenue.server.verification.mail.dto.Recipient;
import com.bookmyvenue.server.verification.mail.dto.Sender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class BrevoClient {

    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestClient restClient;
    private final BrevoProperties brevoProperties;

    public void sendEmail(String to, String subject, String htmlContent) {

        BrevoEmailRequest request = BrevoEmailRequest.builder()
                .sender(new Sender(
                        brevoProperties.getSenderName(),
                        brevoProperties.getSenderEmail()))
                .to(List.of(new Recipient(to)))
                .subject(subject)
                .htmlContent(htmlContent)
                .build();

        try {
            BrevoResponse response = restClient.post()
                    .uri(BREVO_URL)
                    .header("api-key", brevoProperties.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(BrevoResponse.class);

            log.info("Brevo Response: {}", response);

        } catch (Exception e) {
            log.error("Brevo email sending failed", e);
            throw e;
        }

    }
}