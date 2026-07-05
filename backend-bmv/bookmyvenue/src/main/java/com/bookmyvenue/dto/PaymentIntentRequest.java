package com.bookmyvenue.dto;

import lombok.Data;

@Data
public class PaymentIntentRequest {
    private Integer bookingId;
    private Long amount;
    private String currency;
}
