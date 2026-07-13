package com.bookmyvenue.server.venue.repository;

import com.bookmyvenue.server.venue.entity.VenueImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueImageRepository extends JpaRepository<VenueImage,Long> {
}
