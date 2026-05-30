package com.example.bookMyVenue.Venue.Repository;

import com.example.bookMyVenue.Venue.Model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnerVenueRepo extends JpaRepository<Venue,Long> {
}
