package com.bookmyvenue.backend.repository;
import com.bookmyvenue.backend.dto.venueCategory.VenueCategoryResponse;
import com.bookmyvenue.backend.entity.Venue;
import com.bookmyvenue.backend.entity.VenueAvailability;
import com.bookmyvenue.backend.entity.VenueCategory;
import com.bookmyvenue.backend.enums.VenueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> ,
        JpaSpecificationExecutor<Venue> {

    List<VenueAvailability> findByVenueId(Long venueId);
    List<Venue> findByStatus(VenueStatus status);

    List<Venue> findByCity(String city);

    List<Venue> findByOwnerUserUserId(Long userId);

    boolean existsByVenueName(String venueName);

    long countByOwnerUserUserId(Long ownerId);

}
