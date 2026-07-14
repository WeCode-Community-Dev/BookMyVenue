package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.Book.BookingRequest;
import com.bookmyvenue.backend.dto.Book.BookingResponse;
import com.bookmyvenue.backend.dto.Book.BookingStatusRequest;
import com.bookmyvenue.backend.entity.Booking;
import com.bookmyvenue.backend.entity.Users;
import com.bookmyvenue.backend.entity.Venue;
import com.bookmyvenue.backend.enums.BookingStatus;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.exception.SlotAlreadyBookedException;
import com.bookmyvenue.backend.mapper.AmenityMapper;
import com.bookmyvenue.backend.mapper.BookingMapper;
import com.bookmyvenue.backend.repository.BookingRepository;
import com.bookmyvenue.backend.repository.PaymentRepository;
import com.bookmyvenue.backend.repository.UserRepository;
import com.bookmyvenue.backend.repository.VenueRepository;
import com.bookmyvenue.backend.specification.BookingSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final VenueRepository venueRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository usersRepository;

    private final BookingMapper bookingMapper;
    @Override
    public BookingResponse createBooking(
            BookingRequest request) {


        Venue venue = venueRepository
                .findById(request.getVenueId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found"));

        Users user = usersRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"));

        // Time Slot Validation

        long overlapCount =
                bookingRepository.countOverlappingBookings(
                        request.getVenueId(),
                        request.getBookingDate(),
                        request.getStartTime(),
                        request.getEndTime());

        if (overlapCount > 0) {
            throw new SlotAlreadyBookedException(
                    "Venue is already booked for the selected time slot");
        }

        Booking booking =
                bookingMapper.toEntity(request);

        booking.setVenue(venue);
        booking.setUser(user);

        // Amount Calculation

        BigDecimal totalAmount =
                venue.getBasePrice();

        booking.setTotalAmount(totalAmount);
        booking.setPaidAmount(BigDecimal.ZERO);
        booking.setBalanceAmount(totalAmount);

        booking.setBookingStatus(
                BookingStatus.PENDING_PAYMENT);

        Booking savedBooking =
                bookingRepository.save(booking);

        return bookingMapper.toResponse(savedBooking);
    }

    @Override
    public BookingResponse getBookingById(Long bookingId) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found"));

        return bookingMapper.toResponse(booking);
    }


    @Override
    public List<BookingResponse> getAllBookings() {

        return bookingRepository.findAll()
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getBookingsByUser(Long userId) {

        return bookingRepository
                .findByUserUserId(userId)
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getBookingsByOwner(Long ownerId) {

        return bookingRepository
                .findByVenueOwnerUserUserId(ownerId)
                .stream()
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Override
    public BookingResponse updateBookingStatus(
            Long bookingId,
            BookingStatusRequest request) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + bookingId));

        BookingStatus newStatus =
                request.getBookingStatus();

        booking.setBookingStatus(newStatus);

        // Handle cancellation
        if (BookingStatus.CANCELLED.equals(newStatus)) {

            booking.setCancellationAt(
                    LocalDateTime.now());

            booking.setCancellationReason(
                    request.getCancellationReason());

            booking.setCancelledBy(
                    request.getCancelledBy());
        }

        Booking updatedBooking =
                bookingRepository.save(booking);

        return bookingMapper.toResponse(
                updatedBooking);
    }
    @Override
    public void cancelBooking(Long bookingId) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found"));

        booking.setBookingStatus(
                BookingStatus.CANCELLED);

        booking.setCancellationAt(
                LocalDateTime.now());

        booking.setCancellationReason(
                "Cancelled by User");

        bookingRepository.save(booking);
    }
    @Override
    public List<BookingResponse> searchBookings(BookingRequest request) {

        Specification<Booking> spec =
                BookingSpecification.build(
                        request.getVenueId(),
                        request.getUserId(),
                        request.getBookingStatus(),
                        request.getBookingDate()
                );

        List<Booking> bookings = bookingRepository.findAll(spec);
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .toList();
    }
}
