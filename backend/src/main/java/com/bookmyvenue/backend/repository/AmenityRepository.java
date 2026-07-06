package com.bookmyvenue.backend.repository;

import com.bookmyvenue.backend.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    boolean existsByAmenityName(String amenityName);
}
