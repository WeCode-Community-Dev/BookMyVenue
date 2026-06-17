package com.bookmyvenue.backend.dto.Venue;

import com.bookmyvenue.backend.enums.VenueType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class VenueSearchRequest {

    private Long categoryId;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Integer capacity;

    private LocalDate availableDate;

    private String city;


    private VenueType eventType;

    private Integer guestCount;

    private BigDecimal maxRate;

    private List<Long> amenityIds;
}