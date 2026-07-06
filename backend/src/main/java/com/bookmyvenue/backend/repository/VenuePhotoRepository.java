package com.bookmyvenue.backend.repository;

import com.bookmyvenue.backend.entity.VenuePhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenuePhotoRepository extends JpaRepository<VenuePhoto, Long> {

    List<VenuePhoto> findByVenue_VenueId(Long venueId);

    List<VenuePhoto> findByVenue_VenueIdOrderByDisplayOrderAsc(Long venueId);
}