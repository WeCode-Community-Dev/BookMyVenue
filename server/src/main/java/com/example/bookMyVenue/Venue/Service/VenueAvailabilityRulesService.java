package com.example.bookMyVenue.Venue.Service;

import com.example.bookMyVenue.Booking.Enums.BookingStatus;
import com.example.bookMyVenue.Booking.Repository.BookingRepository;
import com.example.bookMyVenue.Exceptions.NoSuchRulesException;
import com.example.bookMyVenue.Exceptions.NoSuchVenueException;
import com.example.bookMyVenue.Venue.DTO.VenueAvailabilityRulesRequest;
import com.example.bookMyVenue.Venue.DTO.VenueAvailabiltyRulesResponse;
import com.example.bookMyVenue.Venue.Enums.DurationType;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityRules;
import com.example.bookMyVenue.Venue.Repository.VenueAvailabilityRulesRepo;
import com.example.bookMyVenue.Venue.Repository.VenueRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueAvailabilityRulesService {

    private final VenueAvailabilityRulesRepo ruleRepository;
    private final VenueRepo venueRepository;
    private final BookingRepository bookingRepository;

    // Used everywhere else (slot generation, booking creation) to resolve the rule for a given date
    public VenueAvailabilityRules getRuleForDate(Long venueId, LocalDate date) {
        return ruleRepository
                .findFirstByVenue_IdAndEffectiveFromLessThanEqualOrderByEffectiveFromDesc(venueId, date)
                .orElseThrow(() -> new NoSuchRulesException("No availability rule found for this venue/date"));
    }

    public VenueAvailabiltyRulesResponse getActiveRule(Long venueId) {
        VenueAvailabilityRules rule = getRuleForDate(venueId, LocalDate.now());
        return mapToResponse(rule, null);
    }

    public VenueAvailabiltyRulesResponse getUpcomingRule(Long venueId) {
        return ruleRepository
                .findFirstByVenue_IdAndEffectiveFromGreaterThanOrderByEffectiveFromAsc(venueId, LocalDate.now())
                .map(r -> mapToResponse(r, null))
                .orElse(null); // no upcoming change scheduled
    }

    public List<VenueAvailabiltyRulesResponse> getRuleHistory(Long venueId) {
        LocalDate today = LocalDate.now();
        return ruleRepository.findByVenue_IdOrderByEffectiveFromDesc(venueId).stream()
                .map(r -> mapToResponse(r, null))
                .toList();
    }

    // Create the venue's very first rule (called internally during venue creation)
    @Transactional
    public VenueAvailabilityRules createDefaultRule(Venue venue, VenueAvailabilityRulesRequest request) {
        validateDurationFields(request);

        VenueAvailabilityRules rule = buildFromRequest(request);
        rule.setVenue(venue);
        rule.setEffectiveFrom(LocalDate.now()); // first ever rule — active immediately

        return ruleRepository.save(rule);
    }

    // Change the rule going forward — auto-computes effectiveFrom, never touches past/active rule
    @Transactional
    public VenueAvailabiltyRulesResponse createNewRule(Long venueId, VenueAvailabilityRulesRequest request) {
        validateDurationFields(request);

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new NoSuchVenueException("Venue not found"));

        LocalDate today = LocalDate.now();

        // If an UPCOMING rule already exists, replace that instead of stacking a second one
        // (avoids ever having two rules scheduled for the same/overlapping future date)
        ruleRepository.findFirstByVenue_IdAndEffectiveFromGreaterThanOrderByEffectiveFromAsc(venueId, today)
                .ifPresent(existingUpcoming -> {
                    throw new IllegalStateException(
                            "An upcoming rule change already exists effective from " +
                                    existingUpcoming.getEffectiveFrom() +
                                    ". Update that rule instead of creating a new one.");
                });

        LocalDate lastBookingDate = bookingRepository
                .findMaxBookingDateByVenueAndStatusIn(venueId, List.of(BookingStatus.CONFIRMED, BookingStatus.PENDING))
                .orElse(null);

        LocalDate effectiveFrom = (lastBookingDate != null)
                ? lastBookingDate.plusDays(1)
                : today.plusDays(1); // no bookings — still push to tomorrow, keep today's rule untouched for the rest of today

        if (ruleRepository.existsByVenue_IdAndEffectiveFrom(venueId, effectiveFrom)) {
            throw new IllegalStateException("A rule is already effective from " + effectiveFrom);
        }

        VenueAvailabilityRules newRule = buildFromRequest(request);
        newRule.setVenue(venue);
        newRule.setEffectiveFrom(effectiveFrom);

        VenueAvailabilityRules saved = ruleRepository.save(newRule);
        return mapToResponse(saved, null);
    }

    // Update is allowed ONLY on a rule that hasn't taken effect yet (effectiveFrom > today)
    @Transactional
    public VenueAvailabiltyRulesResponse updateUpcomingRule(Long ruleId, VenueAvailabilityRulesRequest request) {
        validateDurationFields(request);

        VenueAvailabilityRules rule = ruleRepository.findById(ruleId)
                .orElseThrow(() -> new NoSuchRulesException("Rule not found"));

        LocalDate today = LocalDate.now();

        if (!rule.getEffectiveFrom().isAfter(today)) {
            throw new IllegalStateException(
                    "Only an upcoming rule (effective after today) can be edited. " +
                            "This rule is already active or in the past — create a new rule instead.");
        }

        rule.setDurationType(request.getDurationType());
        rule.setDurationHour(request.getDurationType() == DurationType.HOURLY ? request.getDurationHour() : null);
        rule.setWeekStartDay(request.getWeekStartDay());
        rule.setWeekEndDay(request.getWeekEndDay());
        rule.setOperatingStartTime(request.getOperatingStartTime());
        rule.setOperatingEndTime(request.getOperatingEndTime());
        rule.setWeekdayDayRate(request.getWeekdayDayRate());
        rule.setWeekdayNightRate(request.getWeekdayNightRate());
        rule.setWeekendDayRate(request.getWeekendDayRate());
        rule.setWeekendNightRate(request.getWeekendNightRate());
        // effectiveFrom intentionally NOT editable here — it's system-computed;
        // if the owner needs a different date, that's a business decision requiring
        // re-running createNewRule after bookings shift, not a manual override.

        VenueAvailabilityRules saved = ruleRepository.save(rule);
        return mapToResponse(saved, null);
    }

    private void validateDurationFields(VenueAvailabilityRulesRequest req) {
        if (req.getDurationType() == DurationType.HOURLY && req.getDurationHour() == null) {
            throw new IllegalArgumentException("durationHour is required for HOURLY duration type");
        }
        if (req.getDurationType() != DurationType.HOURLY && req.getDurationHour() != null) {
            throw new IllegalArgumentException("durationHour should only be set for HOURLY duration type");
        }
    }

    private VenueAvailabilityRules buildFromRequest(VenueAvailabilityRulesRequest req) {
        return VenueAvailabilityRules.builder()
                .durationType(req.getDurationType())
                .durationHour(req.getDurationType() == DurationType.HOURLY ? req.getDurationHour() : null)
                .weekStartDay(req.getWeekStartDay())
                .weekEndDay(req.getWeekEndDay())
                .operatingStartTime(req.getOperatingStartTime())
                .operatingEndTime(req.getOperatingEndTime())
                .weekdayDayRate(req.getWeekdayDayRate())
                .weekdayNightRate(req.getWeekdayNightRate())
                .weekendDayRate(req.getWeekendDayRate())
                .weekendNightRate(req.getWeekendNightRate())
                .build();
    }
    private VenueAvailabiltyRulesResponse mapToResponse(VenueAvailabilityRules rule, String status) {

        LocalDate today = LocalDate.now();
        if(status==null){
            status = rule.getEffectiveFrom().isAfter(today) ? "UPCOMING" : "ACTIVE";
        }
        return VenueAvailabiltyRulesResponse.builder()
                .id(rule.getId())
                .venueId(rule.getVenue().getId())
                .durationType(rule.getDurationType())
                .durationHour(rule.getDurationHour())
                .weekStartDay(rule.getWeekStartDay())
                .weekEndDay(rule.getWeekEndDay())
                .operatingStartTime(rule.getOperatingStartTime())
                .operatingEndTime(rule.getOperatingEndTime())
                .weekdayDayRate(rule.getWeekdayDayRate())
                .weekdayNightRate(rule.getWeekdayNightRate())
                .weekendDayRate(rule.getWeekendDayRate())
                .weekendNightRate(rule.getWeekendNightRate())
                .effectiveFrom(rule.getEffectiveFrom())
                .status(status)
                .build();
    }
}
