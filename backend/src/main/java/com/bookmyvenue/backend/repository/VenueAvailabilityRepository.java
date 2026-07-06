package com.bookmyvenue.backend.repository;
import com.bookmyvenue.backend.entity.VenueAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueAvailabilityRepository
        extends JpaRepository<VenueAvailability, Long> {

    List<VenueAvailability> findByVenue_VenueId(Long venueId);
}