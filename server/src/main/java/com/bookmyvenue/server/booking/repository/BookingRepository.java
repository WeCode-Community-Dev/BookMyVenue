package com.bookmyvenue.server.booking.repository;

import com.bookmyvenue.server.booking.entity.Booking;
import com.bookmyvenue.server.booking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    boolean existsBySlotTemplateIdAndBookingDateAndStatusIn(
            Long slotTemplateId,
            LocalDate bookingDate,
            List<BookingStatus> statuses
    );

    List<Booking> findByUserId(UUID userId);

    List<Booking> findByVenueIdAndBookingDateAndStatusIn(
            Long venueId,
            LocalDate bookingDate,
            List<BookingStatus> statuses
    );

    List<Booking> findByStatusAndExpiresAtBefore(
            BookingStatus status,
            LocalDateTime time
    );

    @Query("""
    SELECT b
    FROM Booking b
    WHERE b.venue.owner.id = :vendorId
      AND (:status IS NULL OR b.status = :status)
      AND (:venueId IS NULL OR b.venue.id = :venueId)
    ORDER BY b.createdAt DESC
""")
    List<Booking> findVendorBookings(
            @Param("vendorId") UUID vendorId,
            @Param("status") BookingStatus status,
            @Param("venueId") Long venueId
    );
}