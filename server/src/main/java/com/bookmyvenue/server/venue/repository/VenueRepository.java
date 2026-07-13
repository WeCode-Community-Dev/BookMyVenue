package com.bookmyvenue.server.venue.repository;

import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.entity.VenueStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VenueRepository extends JpaRepository<Venue,Long> {
    List<Venue> findByStatus(VenueStatus status);
    Optional<Venue> findByIdAndStatus(
            Long id,
            VenueStatus status
    );
    List<Venue> findByStatusAndDistrictContainingIgnoreCase(
            VenueStatus status,
            String district
    );

    List<Venue> findByStatusAndCategoryId(
            VenueStatus status,
            Long categoryId
    );

    List<Venue> findByStatusAndDistrictContainingIgnoreCaseAndCategoryId(
            VenueStatus status,
            String district,
            Long categoryId
    );
    List<Venue> findByStatusAndNameContainingIgnoreCase(
            VenueStatus status,
            String keyword
    );

    List<Venue> findByOwnerId(UUID ownerId);

    Optional<Venue> findByIdAndOwnerId(Long id, UUID ownerId);


    long countByStatus(VenueStatus status);

    Page<Venue> findByStatus(VenueStatus status, Pageable pageable);
}
