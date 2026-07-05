package com.example.bookMyVenue.Venue.Repository;

import com.example.bookMyVenue.Venue.Model.VenueVerificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueVerificationLogRepo extends JpaRepository<VenueVerificationLog,Long> {
}
