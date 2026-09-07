package com.example.bookMyVenue.Venue.Service;

import com.example.bookMyVenue.Common.util.SlotValidationUtil;
import com.example.bookMyVenue.Enums.VenueActiveStatus;
import com.example.bookMyVenue.Enums.VenueVerificationStatus;
import com.example.bookMyVenue.Exceptions.NoSuchRulesException;
import com.example.bookMyVenue.Exceptions.NoSuchVenueException;
import com.example.bookMyVenue.Venue.DTO.VenueAvailabilityExceptionRequest;
import com.example.bookMyVenue.Venue.DTO.VenueAvailabilityExceptionResponse;
import com.example.bookMyVenue.Venue.Enums.DurationType;
import com.example.bookMyVenue.Venue.Enums.VenueExceptionActiveStatus;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityException;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityRules;
import com.example.bookMyVenue.Venue.Repository.VenueAvailabilityExceptionRepository;
import com.example.bookMyVenue.Venue.Repository.VenueRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueAvailabilityExceptionService {

    private final VenueAvailabilityExceptionRepository exceptionRepository;
    private final VenueRepo venueRepository;
    private final VenueAvailabilityRulesService rulesService;
    private final SlotValidationUtil slotValidationUtil;

    @Transactional
    public VenueAvailabilityExceptionResponse createException(Long venueId, VenueAvailabilityExceptionRequest request) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new NoSuchVenueException("Venue not found"));

        validateVenueIsBookable(venue);

        if (request.getExceptionDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Cannot create an exception for a past date");
        }

        VenueAvailabilityRules rule = rulesService.getRuleForDate(venueId, request.getExceptionDate());

        LocalTime startTime;
        LocalTime endTime;

        if (rule.getDurationType() == DurationType.HOURLY) {

            if (request.getStartTime() == null || request.getEndTime() == null) {
                throw new IllegalArgumentException("startTime and endTime are required for HOURLY venues");
            }
            if (!request.getEndTime().isAfter(request.getStartTime())) {
                throw new IllegalArgumentException("endTime must be after startTime");
            }
            if (request.getStartTime().isBefore(rule.getOperatingStartTime())
                    || request.getEndTime().isAfter(rule.getOperatingEndTime())) {
                throw new IllegalArgumentException("Exception time must fall within the venue's operating hours");
            }

            slotValidationUtil.validateAlignsToSlotBoundaries(request.getStartTime(), request.getEndTime(), rule);

            startTime = request.getStartTime();
            endTime = request.getEndTime();

        } else {
            startTime = null;
            endTime = null;
        }

        // Prevent overlapping exceptions on the same date
        boolean overlaps = exceptionRepository
                .existsOverlapping(venueId, request.getExceptionDate(), startTime, endTime);
        if (overlaps) {
            throw new IllegalStateException("An overlapping exception already exists for this date/time");
        }

        VenueAvailabilityException exception = VenueAvailabilityException.builder()
                .venue(venue)
                .exceptionDate(request.getExceptionDate())
                .startTime(startTime)
                .endTime(endTime)
                .exceptionType(request.getExceptionType())
                .reason(request.getReason())
                .status(VenueExceptionActiveStatus.ACTIVE)
                .build();

        return mapToResponse(exceptionRepository.save(exception));
    }

    public List<VenueAvailabilityExceptionResponse> getExceptions(Long venueId) {
        return exceptionRepository.findByVenue_IdAndStatusOrderByExceptionDateAsc(venueId, VenueExceptionActiveStatus.ACTIVE)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Soft-cancel instead of delete — keeps audit trail, mirrors the "no delete" philosophy from rules
    @Transactional
    public void cancelException(Long exceptionId) {
        VenueAvailabilityException exception = exceptionRepository.findById(exceptionId)
                .orElseThrow(() -> new NoSuchRulesException("Exception not found"));

        if (exception.getExceptionDate().isBefore(LocalDate.now())) {
            throw new IllegalStateException("Cannot cancel an exception for a past date");
        }

        exception.setStatus(VenueExceptionActiveStatus.CANCELLED);
        exceptionRepository.save(exception);
    }

    private void validateVenueIsBookable(Venue venue) {
        if (venue.getVenueActiveStatus() != VenueActiveStatus.ACTIVE
                || venue.getVenueVerificationStatus() != VenueVerificationStatus.VERIFIED) {
            throw new IllegalStateException(
                    "Venue must be ACTIVE and APPROVED before availability exceptions can be set");
        }
    }

    private VenueAvailabilityExceptionResponse mapToResponse(VenueAvailabilityException e) {
        return VenueAvailabilityExceptionResponse.builder()
                .id(e.getId())
                .venueId(e.getVenue().getId())
                .exceptionDate(e.getExceptionDate())
                .startTime(e.getStartTime())
                .endTime(e.getEndTime())
                .exceptionType(e.getExceptionType())
                .reason(e.getReason())
                .status(e.getStatus())
                .build();
    }

//    private void validateAlignsToSlotBoundaries(LocalTime start, LocalTime end, VenueAvailabilityRules rule) {
//
//        long slotDurationHours = rule.getDurationHour();
//
//        if (start.getMinute() != 0 || start.getSecond() != 0) {
//            throw new IllegalArgumentException("startTime must be on the hour (e.g. 10:00, 12:00)");
//        }
//        if (end.getMinute() != 0 || end.getSecond() != 0) {
//            throw new IllegalArgumentException("endTime must be on the hour (e.g. 12:00, 14:00)");
//        }
//
//        long hoursFromOpening = Duration.between(rule.getOperatingStartTime(), start).toHours();
//        long durationHours = Duration.between(start, end).toHours();
//
//        if (hoursFromOpening % slotDurationHours != 0) {
//            throw new IllegalArgumentException(
//                    "startTime must align with the venue's slot boundaries (slots start every " +
//                            slotDurationHours + " hour(s) from " + rule.getOperatingStartTime() + ")");
//        }
//
//        if (durationHours % slotDurationHours != 0) {
//            throw new IllegalArgumentException(
//                    "Exception duration must be a multiple of the slot duration (" +
//                            slotDurationHours + " hour(s))");
//        }
//    }
}