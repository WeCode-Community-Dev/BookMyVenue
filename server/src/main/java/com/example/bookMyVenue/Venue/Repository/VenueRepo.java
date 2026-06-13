package com.example.bookMyVenue.Venue.Repository;

import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Venue.Model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepo extends JpaRepository<Venue,Long> {
    public List<Venue> findAllByVenueVerificationStatusAndVenueActiveStatus(
            VenueVerificationStatus verificationStatus,
            VenueActiveStatus venueActiveStatus );

    public Venue findByIdAndVenueVerificationStatusAndVenueActiveStatus(
            Long id,
            VenueVerificationStatus verificationStatus,
            VenueActiveStatus venueActiveStatus
    );
}
