package com.example.bookMyVenue.Venue.Service;

import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Exceptions.NoSuchVenueException;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Repository.VenueRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class VenueService {

    public final VenueRepo venueRepo;

    public List<Venue> getAllActiveVenues() {
        return venueRepo.findAllByVenueVerificationStatusAndVenueActiveStatus(VenueVerificationStatus.VERIFIED, VenueActiveStatus.ACTIVE);
    }

    public Venue getVenueById(Long id) {
        if(venueRepo.existsById(id)){
            return venueRepo.findByIdAndVenueVerificationStatusAndVenueActiveStatus(id,VenueVerificationStatus.VERIFIED, VenueActiveStatus.ACTIVE);
        }
        else {
            throw new NoSuchVenueException("No venue Exist by id" + id);
        }
    }
}
