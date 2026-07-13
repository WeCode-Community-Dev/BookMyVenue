package com.bookmyvenue.server.venue.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateVenueRequest {
    private String name;
    private String description;
    private String address;
    private String district;
    private Integer capacity;
    private BigDecimal pricePerSlot;
    @DecimalMin("0.00")
    @DecimalMax("100.00")
    private BigDecimal advancePercentage;
    private Long categoryId;
}