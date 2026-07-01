package com.bookmyvenue.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.bookmyvenue.model.BookingCancellation;

public interface  BookingCancellationRepository extends JpaRepository<BookingCancellation, Integer> {
    // Find cancel request by booking id
    Optional<BookingCancellation> findByBookingId(Integer bookingId);

    // All cancel requests for venues owned by a specific owner
    @Query("SELECT bc FROM BookingCancellation bc " +
           "WHERE bc.booking.venue.user.id = :ownerId")
    Page<BookingCancellation> findByVenueOwnerId(Integer ownerId, Pageable pageable);

    // All pending cancel requests for owner
    @Query("SELECT bc FROM BookingCancellation bc " +
           "WHERE bc.booking.venue.user.id = :ownerId " +
           "AND bc.status = 'PENDING'")
    List<BookingCancellation> findPendingByVenueOwnerId(Integer ownerId);
}
