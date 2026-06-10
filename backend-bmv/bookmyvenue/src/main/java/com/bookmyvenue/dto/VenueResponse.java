package com.bookmyvenue.dto;

import java.time.LocalDateTime;

import com.bookmyvenue.model.Venues;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VenueResponse {
    private Integer id;
    private String venueName;
    private String venueType;
    private String location;
    private String venueDescription;
    private Integer capacity;
    private Integer price;
    private String parkingAvailable;
    private String imageUrl;
    private Boolean termsAccepted;
    private String status;
    private String ownerName;
    private String ownerEmail;
    private LocalDateTime createdAt;

    public static VenueResponse from(Venues venue) {
        return VenueResponse.builder()
                .id(venue.getId())
                .venueName(venue.getVenueName())
                .venueType(venue.getVenueType().name())
                .location(venue.getLocation())
                .venueDescription(venue.getVenueDescription())
                .capacity(venue.getCapacity())
                .price(venue.getPrice())
                .parkingAvailable(venue.getParkingAvailable().name())
                .imageUrl(venue.getImageUrl())
                .termsAccepted(venue.getTermsAccepted())
                .status(venue.getStatus().name())
                .ownerName(venue.getUser().getName())
                .ownerEmail(venue.getUser().getEmail())
                .createdAt(venue.getCreatedAt())
                .build();
    }
}