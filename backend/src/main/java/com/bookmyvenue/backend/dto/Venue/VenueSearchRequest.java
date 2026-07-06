package com.bookmyvenue.backend.dto.Venue;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class VenueSearchRequest {

      private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Integer capacity;

    private LocalDate availableDate;

    private String city;

    private Long eventCategoryId;

    private Integer guestCount;

    private BigDecimal maxRate;

    private List<Long> amenityIds;
}