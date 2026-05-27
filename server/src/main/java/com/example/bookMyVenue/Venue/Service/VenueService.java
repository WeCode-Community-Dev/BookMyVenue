package com.example.bookMyVenue.Venue.Service;

import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Venue.DTO.VenueRequest;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Repository.VenueRepo;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class VenueService {
    private final VenueRepo venueRepo;

    public void createVenue(VenueRequest venueRequest) {
        mapToVenue(venueRequest);
    }

    private Venue mapToVenue( VenueRequest venueRequest) {
        return Venue.builder()
                .city(venueRequest.getCity())
                .name(venueRequest.getName())
                .address(venueRequest.getAddress())
                .description(venueRequest.getDescription())
                .verificationStatus(VenueVerificationStatus.PENDING)
                .status(VenueActiveStatus.INACTIVE)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
