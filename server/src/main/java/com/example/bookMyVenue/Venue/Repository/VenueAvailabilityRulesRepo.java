package com.example.bookMyVenue.Venue.Repository;

import com.example.bookMyVenue.Venue.DTO.VenueAvailabilityRulesRequest;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityRules;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VenueAvailabilityRulesRepo extends JpaRepository<VenueAvailabilityRules, Long> {
    public boolean existsByVenue(Venue venue);

    public Optional<List<VenueAvailabilityRules>> findByVenue(Venue venue);


    Optional<VenueAvailabilityRules> findFirstByVenue_IdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(
            Long venueId, LocalDate today);

    Optional<VenueAvailabilityRules> findFirstByVenue_IdAndEffectiveFromGreaterThanOrderByEffectiveFromAsc(
            Long venueId, LocalDate today);

    List<VenueAvailabilityRules> findByVenue_IdOrderByEffectiveFromDesc(Long venueId);

    boolean existsByVenue_IdAndEffectiveFrom(Long venueId, LocalDate effectiveFrom);
}

