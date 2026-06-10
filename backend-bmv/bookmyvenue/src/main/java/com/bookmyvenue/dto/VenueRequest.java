package com.bookmyvenue.dto;
import com.bookmyvenue.model.Venues;

import lombok.Data;

@Data
public class VenueRequest {
    private String venueName;
    private Venues.VenueType venueType;
    private String location;
    private String venueDescription;
    private Integer capacity;
    private Integer price;
    private Venues.ParkingAvailability parkingAvailable;
    private String imageUrl;
    private Boolean termsAccepted;
}
