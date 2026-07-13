package com.bookmyvenue.server.verification.mail.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class BrevoEmailRequest {

    private Sender sender;

    private List<Recipient> to;

    private String subject;

    private String htmlContent;

}