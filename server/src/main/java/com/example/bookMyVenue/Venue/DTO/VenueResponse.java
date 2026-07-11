package com.example.bookMyVenue.Venue.DTO;

import com.example.bookMyVenue.Enums.AmenityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueResponse {

    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private Double pricePerHour;
    private List<String> imageFiles;
    private VenueAvailabiltyRulesResponse activeAvailabilityRule;
    private String venueType;
    private Boolean parking;
    private Integer seatingCapacity;
    private Set<AmenityType> amenities;
    private Integer maxAdvanceBookingDays;



}
