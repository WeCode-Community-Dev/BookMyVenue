package com.bookmyvenue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentIntentResponse {
   private String clientSecret;
   private String publishableKey;
   private Long amount;
   private String currency;
   private Integer bookingId; 
}
