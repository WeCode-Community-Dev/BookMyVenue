package com.bookmyvenue.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bookmyvenue.model.Venues;
import com.bookmyvenue.model.Venues.VenueStatus;

public interface  VenueRepository extends JpaRepository<Venues, Integer>{
    List<Venues> findByUserId(Integer ownerId);
    List<Venues> findByStatus(VenueStatus status);
    List<Venues> findByUserIdAndStatus(Integer ownerId, VenueStatus status);
}
