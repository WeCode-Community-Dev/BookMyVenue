package com.bookmyvenue.backend.dto.Venue;

import com.bookmyvenue.backend.enums.PricingType;
import com.bookmyvenue.backend.enums.VenueStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class VenueResponse {

    private Long venueId;

    private Long ownerUserId;

    private String ownerName;

    private String venueName;

    private String addressLine1;

    private String addressLine2;

    private String city;

    private String district;

    private String state;

    private String country;

    private String pincode;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private Integer capacity;

    private PricingType pricingType;

    private BigDecimal basePrice;

    private BigDecimal advancePercentage;

    private VenueStatus status;

    private String approvalRemarks;

    private String contactName;

    private String contactEmail;

    private Set<String> amenities;

    private Set<String> categories;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}