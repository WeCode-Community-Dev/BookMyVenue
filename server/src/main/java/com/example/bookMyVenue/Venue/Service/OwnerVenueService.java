package com.example.bookMyVenue.Venue.Service;

import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Exceptions.NoSuchVenueException;
import com.example.bookMyVenue.Exceptions.SaveFailedException;
import com.example.bookMyVenue.Venue.DTO.VenueRequest;
import com.example.bookMyVenue.Venue.DTO.VenueResponse;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Repository.OwnerVenueRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class OwnerVenueService {
    private final OwnerVenueRepo ownerVenueRepo;

    public VenueResponse createVenue(VenueRequest venueRequest) {
        try {
            Venue savedVenue = ownerVenueRepo.save(mapToVenue(venueRequest));
            return mapToVenueResponse(savedVenue);
        }catch (Exception e ){
            throw new SaveFailedException(e);

        }
    }
    public Venue getVenueById(Long id){
        return ownerVenueRepo.findById(id).orElseThrow(()->new NoSuchVenueException("Venue is not existing "+ id));
    }

    private Venue mapToVenue( VenueRequest venueRequest) {
        return Venue.builder()
                .city(venueRequest.getCity())
                .name(venueRequest.getName())
                .address(venueRequest.getAddress())
                .description(venueRequest.getDescription())
                .verificationStatus(VenueVerificationStatus.PENDING)
                .status(VenueActiveStatus.DRAFT)
                .createdAt(LocalDateTime.now())
                .build();
    }
    public VenueResponse mapToVenueResponse(Venue v) {
        return VenueResponse.builder()
                .VenueName(v.getName())
                .status(v.getStatus().name())
                .build();
    }

  public Venue updateVenue(Venue venue){
      return ownerVenueRepo.save(venue);
  }

}
