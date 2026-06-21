package com.bookmyvenue.backend.dto.Venue;

import com.bookmyvenue.backend.dto.venuePhoto.VenuePhotoRequest;
import com.bookmyvenue.backend.enums.PricingType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
public class VenueCreationRequest {

    @NotNull
    private Long ownerUserId;

    @NotBlank
    private String venueName;

    @NotBlank
    private String addressLine1;

    private String addressLine2;

    @NotBlank
    private String city;

    @NotBlank
    private String district;

    @NotBlank
    private String state;

    @NotBlank
    private String country;

    private String pincode;

    private BigDecimal latitude;

    private BigDecimal longitude;

    @NotNull
    private Integer capacity;

    @NotNull
    private PricingType pricingType;

    @NotNull
    private BigDecimal basePrice;

    private BigDecimal advancePercentage;

    private Set<Long> amenityIds;

    private Set<Long> supportedEventCategoryIds;

    private List<VenuePhotoRequest> photos;

    @NotNull
    private Long createdBy;
}