package com.bookmyvenue.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.bookmyvenue.model.Booking;
import com.bookmyvenue.model.Booking.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserId(Integer userId);
    List<Booking> findByVenueId(Integer venueId);
    List<Booking> findByBookingStatus(BookingStatus status);
    boolean existsByVenueIdAndBookingDateAndBookingStatusIn(Integer venueId, LocalDate bookingDate, List<BookingStatus> statuses);
    List<Booking> findByVenueUserId(Integer userId);

    @Query("SELECT b FROM Booking b WHERE b.bookingStatus = 'PENDING' AND b.bookedOn < :cutoffTime")
    List<Booking> findPendingBookingsOlderThan(@Param("cutoffTime")LocalDateTime cutoffTime);
}
