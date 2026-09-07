package com.example.bookMyVenue.Venue.Repository;

import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Venue.Model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VenueRepo extends JpaRepository<Venue,Long> {
    public List<Venue> findAllByVenueActiveStatus(
            VenueActiveStatus venueActiveStatus );

    public Optional<Venue> findByIdAndVenueActiveStatus(
            Long id,
            VenueActiveStatus venueActiveStatus
    );

    public List<Venue> findAllByVenueVerificationStatus(VenueVerificationStatus status);

    public  List<Venue> findByOwner(User user);
    public  List<Venue> findByOwnerAndVenueVerificationStatus(User user,VenueVerificationStatus status);
}
