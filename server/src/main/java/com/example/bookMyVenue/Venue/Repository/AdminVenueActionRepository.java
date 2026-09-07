package com.example.bookMyVenue.Venue.Repository;

import com.example.bookMyVenue.Venue.Model.AdminVenueActionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminVenueActionRepository extends JpaRepository<AdminVenueActionLog,Long> {
}
