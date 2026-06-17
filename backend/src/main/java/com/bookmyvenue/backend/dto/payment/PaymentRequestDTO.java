package com.bookmyvenue.backend.dto.payment;

import com.bookmyvenue.backend.enums.PaymentType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentRequestDTO {

    private Long bookingId;

    private PaymentType paymentType;

    private BigDecimal amount;

    private LocalDateTime paymentDueDate;
}