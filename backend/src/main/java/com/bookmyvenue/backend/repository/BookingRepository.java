package com.bookmyvenue.backend.repository;

import com.bookmyvenue.backend.dto.Book.BookingResponse;
import com.bookmyvenue.backend.entity.Booking;
import com.bookmyvenue.backend.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface BookingRepository
        extends JpaRepository<Booking, Long>,
        JpaSpecificationExecutor<Booking> {

    long countByUserUserId(Long userId);

    long countByVenueOwnerUserUserId(Long ownerId);

    List<Booking>
    findTop5ByVenueOwnerUserUserIdOrderByCreatedAtDesc(
            Long ownerId);

    long countByVenueVenueId(Long venueId);

    @Query("""
       SELECT COALESCE(SUM(b.totalAmount), 0)
       FROM Booking b
       WHERE b.venue.ownerUser.userId = :ownerId
       AND b.bookingStatus = com.bookmyvenue.backend.enums.BookingStatus.CONFIRMED
       """)
    BigDecimal getRevenueByOwnerId(
            @Param("ownerId") Long ownerId);



    @Query("""
       SELECT COUNT(b)
       FROM Booking b
       WHERE b.venue.venueId = :venueId
       AND b.eventDate = :eventDate
       AND b.bookingStatus NOT IN (
            com.bookmyvenue.backend.enums.BookingStatus.REJECTED,
                    com.bookmyvenue.backend.enums.BookingStatus.CANCELLED
       )
       AND (
            :startTime < b.endTime
            AND :endTime > b.startTime
       )
       """)
    long countOverlappingBookings(
            Long venueId,
            LocalDate eventDate,
            LocalTime startTime,
            LocalTime endTime);

    List<Booking> findByUserUserId(Long userId);

    List<Booking> findByVenueOwnerUserUserId(Long ownerId);
}


