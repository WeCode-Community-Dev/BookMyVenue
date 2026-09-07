package com.example.bookMyVenue.Venue.Repository;

import com.example.bookMyVenue.Venue.Enums.VenueExceptionActiveStatus;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface VenueAvailabilityExceptionRepository extends JpaRepository<VenueAvailabilityException, Long> {

    List<VenueAvailabilityException> findByVenue_IdAndStatusOrderByExceptionDateAsc(
            Long venueId, VenueExceptionActiveStatus status);

    List<VenueAvailabilityException> findByVenue_IdAndExceptionDateAndStatus(
            Long venueId, LocalDate date, VenueExceptionActiveStatus status);

    @Query(value = """
    SELECT COUNT(*) > 0 FROM venue_availability_exceptions e
    WHERE e.venue_id = :venueId
    AND e.exception_date = :date
    AND e.status = 'ACTIVE'
    AND (
        (CAST(:startTime AS time) IS NULL AND CAST(:endTime AS time) IS NULL)
        OR (e.start_time IS NULL AND e.end_time IS NULL)
        OR (e.start_time < CAST(:endTime AS time) AND e.end_time > CAST(:startTime AS time))
    )
    """, nativeQuery = true)
    boolean existsOverlapping(
            @Param("venueId") Long venueId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
}
