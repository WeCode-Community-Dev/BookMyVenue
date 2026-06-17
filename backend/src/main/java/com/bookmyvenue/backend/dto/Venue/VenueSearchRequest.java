package com.bookmyvenue.backend.dto.Venue;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class VenueSearchRequest {

    private Long categoryId;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Integer capacity;

    private LocalDate availableDate;

    private String city;
}