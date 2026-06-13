package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.venueOwnerDashboard.OwnerDashboardResponse;
import com.bookmyvenue.backend.dto.venueOwnerDashboard.OwnerVenueDto;
import com.bookmyvenue.backend.dto.venueOwnerDashboard.RecentBookingDto;
import com.bookmyvenue.backend.entity.Booking;
import com.bookmyvenue.backend.entity.Payment;
import com.bookmyvenue.backend.enums.VenueStatus;
import com.bookmyvenue.backend.repository.BookingRepository;
import com.bookmyvenue.backend.repository.PaymentRepository;
import com.bookmyvenue.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OwnerDashboardServiceImpl
        implements OwnerDashboardService {

    private final VenueRepository venueRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;


    @Override
    public OwnerDashboardResponse getDashboard(
            Long ownerId) {

        Long totalVenues =
                venueRepository
                        .countByOwnerUserUserId(
                                ownerId);

        Long activeVenues =
                venueRepository
                        .countByOwnerUserUserIdAndStatus(
                                ownerId,
                                VenueStatus.APPROVED);

        Long totalBookings =
                bookingRepository
                        .countByVenueOwnerUserUserId(
                                ownerId);

        BigDecimal revenue =
                bookingRepository
                        .getRevenueByOwnerId(
                                ownerId);

        List<RecentBookingDto> recentBookings =
                bookingRepository
                        .findTop5ByVenueOwnerUserUserIdOrderByCreatedAtDesc(
                                ownerId)
                        .stream()
                        .map(this::mapBooking)
                        .toList();

        List<OwnerVenueDto> venues =
                venueRepository
                        .findByOwnerUserUserId(
                                ownerId)
                        .stream()
                        .map(v -> OwnerVenueDto.builder()
                                .venueId(v.getVenueId())
                                .venueName(v.getVenueName())
                                .city(v.getCity())
                                .status(v.getStatus())
                                .bookingCount(
                                        bookingRepository
                                                .countByVenueVenueId(
                                                        v.getVenueId()))
                                .build())
                        .toList();

        return OwnerDashboardResponse.builder()
                .activeVenues(activeVenues)
                .totalVenues(totalVenues)
                .totalBookings(totalBookings)
                .revenueEarned(revenue)
                .averageRating(0.0)
                .recentBookings(recentBookings)
                .venues(venues)
                .build();
    }

    private RecentBookingDto mapBooking(
            Booking booking) {
        Payment payment =
                paymentRepository
                        .findByBookingBookingId(
                                booking.getBookingId())
                        .orElse(null);

        return RecentBookingDto.builder()
                .guestName(
                        booking.getUser()
                                .getFirstName())
                .venueName(
                        booking.getVenue()
                                .getVenueName())
                .bookingDate(
                        booking.getEventDate())
                .amount(
                        payment != null
                                ? payment.getAmount()
                                : BigDecimal.ZERO)
                .status(
                        booking.getBookingStatus())
                .build();
    }
}