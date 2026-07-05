package com.example.bookMyVenue.Booking.Service;

import com.example.bookMyVenue.Booking.DTO.SlotResponse;
import com.example.bookMyVenue.Booking.DTO.VenueSlotsResponse;
import com.example.bookMyVenue.Booking.Enums.SlotStatus;
import com.example.bookMyVenue.Booking.Model.VenueBooking;
import com.example.bookMyVenue.Booking.Repository.BookingRepository;
import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Exceptions.NoSuchVenueException;
import com.example.bookMyVenue.Venue.Enums.VenueExceptionActiveStatus;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityException;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityRules;
import com.example.bookMyVenue.Venue.Repository.VenueAvailabilityExceptionRepository;
import com.example.bookMyVenue.Venue.Repository.VenueRepo;
import com.example.bookMyVenue.Venue.Service.VenueAvailabilityRulesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueSlotService {

    private final VenueRepo venueRepository;
    private final VenueAvailabilityRulesService rulesService;
    private final VenueAvailabilityExceptionRepository exceptionRepository;
    private final BookingRepository bookingRepository;

    public VenueSlotsResponse getSlots(Long venueId, LocalDate date) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new NoSuchVenueException("Venue not found"));

        validateVenueIsBookable(venue);
        validateDateWindow(venue, date);

        VenueAvailabilityRules rule = rulesService.getRuleForDate(venueId, date);

        List<VenueAvailabilityException> exceptions =
                exceptionRepository.findByVenue_IdAndExceptionDateAndStatus(venueId, date, VenueExceptionActiveStatus.ACTIVE);

//        List<Booking> bookings =
//                bookingRepository.findByVenue_IdAndBookingDateAndStatusIn(
//                        venueId, date, List.of(BookingStatus.CONFIRMED, BookingStatus.PENDING));
        List<VenueBooking> bookings = Collections.emptyList();

        List<SlotResponse> slots = switch (rule.getDurationType()) {
            case HOURLY -> generateHourlySlots(rule, date, exceptions, bookings);
            case HALF_DAY -> generateHalfDaySlots(rule, date, exceptions, bookings);
            case FULL_DAY -> generateFullDaySlot(rule, date, exceptions, bookings);
        };

        return VenueSlotsResponse.builder()
                .venueId(venueId)
                .date(date)
                .durationType(rule.getDurationType())
                .slots(slots)
                .build();
    }

    // ---------- HOURLY ----------

    private List<SlotResponse> generateHourlySlots(
            VenueAvailabilityRules rule, LocalDate date,
            List<VenueAvailabilityException> exceptions, List<VenueBooking> bookings) {

        List<SlotResponse> slots = new ArrayList<>();

        LocalTime open = rule.getOperatingStartTime();
        LocalTime close = rule.getOperatingEndTime();
        long stepMinutes = rule.getDurationHour() * 60L;

        long totalOperatingMinutes = Duration.between(open, close).toMinutes();

        // if close <= open, it means closing time is actually on the next day (e.g. 18:00 -> 00:00, or 18:00 -> 02:00)
        if (totalOperatingMinutes <= 0) {
            totalOperatingMinutes += 24 * 60;
        }

        long elapsed = 0;
        while (elapsed + stepMinutes <= totalOperatingMinutes) {
            LocalTime slotStart = open.plusMinutes(elapsed);
            LocalTime slotEnd = open.plusMinutes(elapsed + stepMinutes);

            slots.add(resolveSlot(slotStart, slotEnd, date, rule, exceptions, bookings));

            elapsed += stepMinutes;
        }

        return slots;
    }

    private SlotResponse resolveSlot(
            LocalTime slotStart, LocalTime slotEnd, LocalDate date, VenueAvailabilityRules rule,
            List<VenueAvailabilityException> exceptions, List<VenueBooking> bookings) {

        // 1. Check exceptions first
        for (VenueAvailabilityException ex : exceptions) {
            if (ex.getStartTime() == null && ex.getEndTime() == null) {
                // FULL_DAY-style exception even though venue is HOURLY — blocks everything
                return buildSlot(slotStart, slotEnd, SlotStatus.BLOCKED, ex.getReason(), rule, date);
            }
            if (!slotEnd.isAfter(ex.getStartTime()) || !ex.getEndTime().isAfter(slotStart)) {
                continue; // no overlap
            }
            return buildSlot(slotStart, slotEnd, SlotStatus.BLOCKED, ex.getReason(), rule, date);
        }

        // 2. Check bookings
//        for (VenueBooking b : bookings) {
//            LocalTime bStart = b.getStartTime();
//            LocalTime bEnd = b.getEndTime();
//            if (bStart.isBefore(slotEnd) && bEnd.isAfter(slotStart)) {
//                return buildSlot(slotStart, slotEnd, SlotStatus.BOOKED, null, rule, date);
//            }
//        }

        // 3. Available
        return buildSlot(slotStart, slotEnd, SlotStatus.AVAILABLE, null, rule, date);
    }

    // ---------- HALF_DAY ----------

    private List<SlotResponse> generateHalfDaySlots(
            VenueAvailabilityRules rule, LocalDate date,
            List<VenueAvailabilityException> exceptions, List<VenueBooking> bookings) {

        LocalTime open = rule.getOperatingStartTime();
        LocalTime close = rule.getOperatingEndTime();

        long totalMinutes = Duration.between(open, close).toMinutes();
        LocalTime midpoint = open.plusMinutes(totalMinutes / 2);

        SlotResponse firstHalf = resolveSlot(open, midpoint, date, rule, exceptions, bookings);
        SlotResponse secondHalf = resolveSlot(midpoint, close, date, rule, exceptions, bookings);

        return List.of(firstHalf, secondHalf);
    }

    // ---------- FULL_DAY ----------

    private List<SlotResponse> generateFullDaySlot(
            VenueAvailabilityRules rule, LocalDate date,
            List<VenueAvailabilityException> exceptions, List<VenueBooking> bookings) {

        SlotStatus status = SlotStatus.AVAILABLE;
        String reason = null;

        if (!exceptions.isEmpty()) {
            status = SlotStatus.BLOCKED;
            reason = exceptions.get(0).getReason();
        } else if (!bookings.isEmpty()) {
            status = SlotStatus.BOOKED;
        }

        SlotResponse slot = SlotResponse.builder()
                .startTime(null)
                .endTime(null)
                .status(status)
                .reason(reason)
                .rate(resolveRate(date, rule.getOperatingStartTime(), rule))
                .build();

        return List.of(slot);
    }

    // ---------- Rate resolution ----------

    private SlotResponse buildSlot(
            LocalTime start, LocalTime end, SlotStatus status, String reason,
            VenueAvailabilityRules rule, LocalDate date) {

        return SlotResponse.builder()
                .startTime(start)
                .endTime(end)
                .status(status)
                .reason(reason)
                .rate(resolveRate(date, start, rule))
                .build();
    }

    private BigDecimal resolveRate(LocalDate date, LocalTime slotStart, VenueAvailabilityRules rule) {
        boolean isWeekend = date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
        boolean isNight = !slotStart.isBefore(rule.getNightStartTime()); // assumes nightStartTime field exists

        if (isWeekend) {
            return isNight ? rule.getWeekendNightRate() : rule.getWeekendDayRate();
        } else {
            return isNight ? rule.getWeekdayNightRate() : rule.getWeekdayDayRate();
        }
    }

    // ---------- Validation ----------

    private void validateVenueIsBookable(Venue venue) {
        if (venue.getVenueActiveStatus() != VenueActiveStatus.ACTIVE
                || venue.getVenueVerificationStatus() != VenueVerificationStatus.VERIFIED) {
            throw new IllegalStateException("Venue is not currently bookable");
        }
    }

    private void validateDateWindow(Venue venue, LocalDate date) {
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            throw new IllegalArgumentException("Cannot fetch slots for a past date");
        }
        LocalDate maxDate = today.plusDays(venue.getMaxAdvanceBookingDays());
        if (date.isAfter(maxDate)) {
            throw new IllegalArgumentException(
                    "Date exceeds the venue's maximum advance booking window of " +
                            venue.getMaxAdvanceBookingDays() + " days");
        }
    }
}
