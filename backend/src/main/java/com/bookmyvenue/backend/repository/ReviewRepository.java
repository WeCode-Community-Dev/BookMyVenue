package com.bookmyvenue.backend.repository;

import com.bookmyvenue.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findByVenueVenueId(Long venueId);

    List<Review> findByUserUserId(Long userId);

    boolean existsByVenueVenueIdAndUserUserId(
            Long venueId,
            Long userId);

    @Query("""
       SELECT AVG(r.rating)
       FROM Review r
       WHERE r.venue.venueId = :venueId
       """)
    Double getAverageRating(
            @Param("venueId") Long venueId);

    @Query("""
       SELECT AVG(r.rating)
       FROM Review r
       WHERE r.venue.ownerUser.userId = :ownerId
       """)
    Double getAverageRatingByOwner(
            @Param("ownerId") Long ownerId);

}
