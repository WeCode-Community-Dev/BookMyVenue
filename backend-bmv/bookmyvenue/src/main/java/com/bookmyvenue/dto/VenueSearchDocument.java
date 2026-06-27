package com.bookmyvenue.dto;

import com.bookmyvenue.model.Venues;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueSearchDocument {
    private Integer id;
    private String venueName;
    private String venueType;
    private String location;
    private String venueDescription;
    private Integer capacity;
    private Integer price;
    private String parkingAvailable;
    private String imageUrl;

    public static VenueSearchDocument from(Venues venue) {
        return VenueSearchDocument.builder()
                .id(venue.getId())
                .venueName(venue.getVenueName())
                .venueType(venue.getVenueType().toString())
                .location(venue.getLocation())
                .venueDescription(venue.getVenueDescription())
                .capacity(venue.getCapacity())
                .price(venue.getPrice())
                .parkingAvailable(venue.getParkingAvailable().name())
                .imageUrl(venue.getImageUrl())
                .build();
    }
}
