package com.bookmyvenue.dto;
import com.bookmyvenue.model.Venues;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VenueRequest {

    @NotBlank(message = "Venue Name is required")
    private String venueName;

    private Venues.VenueType venueType;

    @NotBlank(message = "Location is required")
    private String location;
    private String venueDescription;

    @NotBlank(message = "Capacity is required")
    private Integer capacity;

    @NotBlank(message = "Price is required")
    private Integer price;

    @NotBlank(message = "Parking availablity is required")
    private Venues.ParkingAvailability parkingAvailable;
    private String imageUrl;
    private Boolean termsAccepted;
}
