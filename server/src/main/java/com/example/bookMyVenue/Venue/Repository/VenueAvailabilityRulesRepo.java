package com.example.bookMyVenue.Venue.Repository;

import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityRules;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueAvailabilityRulesRepo extends JpaRepository<VenueAvailabilityRules,Long> {
    public boolean existsByVenue(Venue venue);
}
