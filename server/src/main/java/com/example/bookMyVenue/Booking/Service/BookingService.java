package com.example.bookMyVenue.Booking.Service;

import com.example.bookMyVenue.Booking.DTO.*;
import com.example.bookMyVenue.Booking.Enums.BookingStatus;
import com.example.bookMyVenue.Booking.Model.VenueBooking;
import com.example.bookMyVenue.Booking.Repository.BookingRepository;
import com.example.bookMyVenue.Common.util.SlotValidationUtil;
import com.example.bookMyVenue.Config.RuntimeUser;
import com.example.bookMyVenue.Auth.Model.User;
import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Exceptions.BookingNotFoundException;
import com.example.bookMyVenue.Exceptions.NoSuchVenueException;
import com.example.bookMyVenue.Venue.Enums.DurationType;
import com.example.bookMyVenue.Venue.Enums.VenueExceptionActiveStatus;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityException;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityRules;
import com.example.bookMyVenue.Venue.Repository.VenueAvailabilityExceptionRepository;
import com.example.bookMyVenue.Venue.Repository.VenueRepo;
import com.example.bookMyVenue.Venue.Service.VenueAvailabilityRulesService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VenueRepo venueRepository;
    private final VenueAvailabilityRulesService rulesService;
    private final VenueAvailabilityExceptionRepository exceptionRepository;
    private final RuntimeUser currentUserProvider;
    private final SlotValidationUtil slotValidationUtil;

    @Transactional
    public BookingResponse createBooking(Long venueId, BookingCreateRequest request) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new NoSuchVenueException("Venue not found"));

        validateVenueIsBookable(venue);
        validateDateWindow(venue, request.getBookingDate());

        VenueAvailabilityRules rule = rulesService.getRuleForDate(venueId, request.getBookingDate());

        LocalTime startTime;
        LocalTime endTime;

        if (rule.getDurationType() == DurationType.HOURLY) {
            validateHourlyRequest(request, rule);
            startTime = request.getStartTime();
            endTime = request.getEndTime();
        } else {
            // FULL_DAY / HALF_DAY — no times needed, whole-unit booking
            startTime = null;
            endTime = null;
        }

        // Lock existing bookings for this venue+date to serialize concurrent attempts
        bookingRepository.findForUpdateByVenueAndDate(
                venueId, request.getBookingDate(), List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED));

        // Re-check availability under the lock — the actual source of truth, not the frontend's slot view
        validateSlotStillAvailable(venue, request.getBookingDate(), startTime, endTime, rule);

        BigDecimal rate = resolveRate(request.getBookingDate(), startTime, rule);

        VenueBooking booking = VenueBooking.builder()
                .venue(venue)
                .customer(currentUserProvider.getUser())
                .bookingDate(request.getBookingDate())
                .startTime(startTime)
                .endTime(endTime)
                .durationType(rule.getDurationType())
                .appliedRate(rate)
                .eventPurpose(request.getEventPurpose())
                .status(BookingStatus.CONFIRMED)                 .build();

        VenueBooking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    private void validateHourlyRequest(BookingCreateRequest request, VenueAvailabilityRules rule) {
        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new IllegalArgumentException("startTime and endTime are required for this venue");
        }
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("endTime must be after startTime");
        }
        if (request.getStartTime().isBefore(rule.getOperatingStartTime())
                || request.getEndTime().isAfter(rule.getOperatingEndTime())) {
            throw new IllegalArgumentException("Booking time must fall within operating hours");
        }

        slotValidationUtil.validateAlignsToSlotBoundaries(request.getStartTime(), request.getEndTime(), rule);
    }

    private void validateSlotStillAvailable(
            Venue venue, LocalDate date, LocalTime startTime, LocalTime endTime, VenueAvailabilityRules rule) {

        List<VenueAvailabilityException> exceptions = exceptionRepository
                .findByVenue_IdAndExceptionDateAndStatus(venue.getId(), date, VenueExceptionActiveStatus.ACTIVE);

        for (VenueAvailabilityException ex : exceptions) {
            if (ex.getStartTime() == null && ex.getEndTime() == null) {
                throw new IllegalStateException("This date is blocked by the venue owner: " + ex.getReason());
            }
            if (startTime != null && overlaps(startTime, endTime, ex.getStartTime(), ex.getEndTime())) {
                throw new IllegalStateException("This time is blocked by the venue owner: " + ex.getReason());
            }
        }

        // Check existing bookings
        List<VenueBooking> existing = bookingRepository.findByVenue_IdAndBookingDateAndStatusIn(
                venue.getId(), date, List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED));

        for (VenueBooking b : existing) {
            if (startTime == null || b.getStartTime() == null) {
                throw new IllegalStateException("This date is already booked");
            }
            if (overlaps(startTime, endTime, b.getStartTime(), b.getEndTime())) {
                throw new IllegalStateException("This slot is already booked");
            }
        }
    }

    private boolean overlaps(LocalTime aStart, LocalTime aEnd, LocalTime bStart, LocalTime bEnd) {
        return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
    }

    public List<BookingResponse> getMyBookings() {
        User customer = currentUserProvider.getUser();
        return bookingRepository.findByCustomer_IdOrderByBookingDateDesc(customer.getId())
                .stream().map(this::mapToResponse).toList();
    }

    public List<BookingResponse> getVenueBookings(Long venueId) {
        return bookingRepository.findByVenue_IdOrderByBookingDateDesc(venueId)
                .stream().map(this::mapToResponse).toList();
    }

    public BookingResponse getBooking(Long bookingId) {
        VenueBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));
        return mapToResponse(booking);
    }

    @Transactional
    public void cancelBooking(Long bookingId) {
        VenueBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found"));

        User currentUser = currentUserProvider.getUser();
        if (!booking.getCustomer().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You cannot cancel someone else's booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled");
        }
        if (booking.getBookingDate().isBefore(LocalDate.now())) {
            throw new IllegalStateException("Cannot cancel a past booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        // Refund logic plugs in here later, once Stripe is integrated
    }

    private void validateVenueIsBookable(Venue venue) {
        if (venue.getVenueActiveStatus() != VenueActiveStatus.ACTIVE
                || venue.getVenueVerificationStatus() != VenueVerificationStatus.VERIFIED) {
            throw new IllegalStateException("Venue is not currently bookable");
        }
    }

    private void validateDateWindow(Venue venue, LocalDate date) {
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            throw new IllegalArgumentException("Cannot book a past date");
        }
        LocalDate maxDate = today.plusDays(venue.getMaxAdvanceBookingDays());
        if (date.isAfter(maxDate)) {
            throw new IllegalArgumentException(
                    "Date exceeds the venue's maximum advance booking window of " +
                            venue.getMaxAdvanceBookingDays() + " days");
        }
    }

    private BigDecimal resolveRate(LocalDate date, LocalTime startTime, VenueAvailabilityRules rule) {
        boolean isWeekend = date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
        if (rule.getDurationType() != DurationType.HOURLY) {
            return isWeekend ? rule.getWeekendDayRate() : rule.getWeekdayDayRate(); // adjust if full/half-day rates differ
        }
        boolean isNight = !startTime.isBefore(rule.getNightStartTime());
        if (isWeekend) {
            return isNight ? rule.getWeekendNightRate() : rule.getWeekendDayRate();
        } else {
            return isNight ? rule.getWeekdayNightRate() : rule.getWeekdayDayRate();
        }
    }

    private BookingResponse mapToResponse(VenueBooking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .venueId(b.getVenue().getId())
                .venueName(b.getVenue().getName())
                .bookingDate(b.getBookingDate())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .durationType(b.getDurationType())
                .status(b.getStatus())
                .appliedRate(b.getAppliedRate())
                .eventPurpose(b.getEventPurpose())
                .createdAt(b.getCreatedAt())
                .build();
    }


    public List<BookingResponse> getUpcomingBookings(String email) {
        LocalDate today = LocalDate.now();
        List<VenueBooking> bookings = bookingRepository
                .findByCustomer_EmailAndBookingDateGreaterThanEqualOrderByBookingDateAsc(email, today);
        return bookings.stream().map(this::mapToResponse).toList();
    }

    public List<BookingResponse> getPastBookings(String email) {
        LocalDate today = LocalDate.now();
        List<VenueBooking> bookings = bookingRepository
                .findByCustomer_EmailAndBookingDateLessThanOrderByBookingDateDesc(email, today);
        return bookings.stream().map(this::mapToResponse).toList();
    }

    public List<BookingResponse> getAllBookings(String email) {
        List<VenueBooking> bookings = bookingRepository
                .findByCustomer_EmailOrderByBookingDateDesc(email);
        return bookings.stream().map(this::mapToResponse).toList();
    }
}