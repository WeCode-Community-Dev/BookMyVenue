package com.example.bookMyVenue.Venue.DTO;

import com.example.bookMyVenue.Enums.AmenityType;
import com.example.bookMyVenue.Enums.VenueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class VenueRequest {

    @NotBlank
    private String name;
    @NotBlank
    private String description;
    @NotBlank
    private String address;
    @NotBlank
    private String city;


    private VenueAvailabilityRulesRequest venueAvailabilityRulesRequest;

    private VenueType venueType;

    private Boolean parking;
    private Integer seatingCapacity;


    private Set<AmenityType> amenities;
    private String pricePerHour;
    private Integer maxAdvanceBookingDays;



}
