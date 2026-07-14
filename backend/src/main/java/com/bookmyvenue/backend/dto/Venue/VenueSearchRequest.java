package com.bookmyvenue.backend.dto.Venue;

import com.bookmyvenue.backend.enums.EventType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Data
public class VenueSearchRequest {

      private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Integer capacity;

    private LocalDate availableDate;

    private String city;

    private EventType eventType;

    private Integer guestCount;

    private BigDecimal maxRate;

    private List<Long> amenityIds;
}