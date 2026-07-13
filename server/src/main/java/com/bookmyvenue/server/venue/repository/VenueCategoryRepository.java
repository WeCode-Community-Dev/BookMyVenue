package com.bookmyvenue.server.venue.repository;

import com.bookmyvenue.server.venue.entity.VenueCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueCategoryRepository extends JpaRepository<VenueCategory, Long> {
    List<VenueCategory> findAllByOrderByNameAsc();
}
