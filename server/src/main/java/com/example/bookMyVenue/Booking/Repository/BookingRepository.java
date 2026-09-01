package com.example.bookMyVenue.Booking.Repository;

import com.example.bookMyVenue.Booking.Enums.BookingStatus;
import com.example.bookMyVenue.Booking.Model.VenueBooking;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<VenueBooking, Long> {

    List<VenueBooking> findByVenue_IdAndBookingDateAndStatusIn(
            Long venueId, LocalDate date, List<BookingStatus> statuses);

    List<VenueBooking> findByCustomer_IdOrderByBookingDateDesc(Long customerId);

    List<VenueBooking> findByVenue_IdOrderByBookingDateDesc(Long venueId);

    @Query("SELECT MAX(b.bookingDate) FROM VenueBooking b WHERE b.venue.id = :venueId AND b.status IN :statuses")
    Optional<LocalDate> findMaxBookingDateByVenueAndStatusIn(Long venueId, List<BookingStatus> statuses);

    // Row-level lock to prevent race conditions during concurrent booking attempts on the same slot
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM VenueBooking b WHERE b.venue.id = :venueId AND b.bookingDate = :date AND b.status IN :statuses")
    List<VenueBooking> findForUpdateByVenueAndDate(Long venueId, LocalDate date, List<BookingStatus> statuses);

    List<VenueBooking> findByCustomer_EmailAndBookingDateGreaterThanEqualOrderByBookingDateAsc(
            String email, LocalDate date);

    List<VenueBooking> findByCustomer_EmailAndBookingDateLessThanOrderByBookingDateDesc(
            String email, LocalDate date);

    List<VenueBooking> findByCustomer_EmailOrderByBookingDateDesc(String email);
}
