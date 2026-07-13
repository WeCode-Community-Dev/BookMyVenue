package com.bookmyvenue.server.booking.service;

import com.bookmyvenue.server.booking.dto.response.AvailabilityResponse;
import com.bookmyvenue.server.booking.entity.Booking;
import com.bookmyvenue.server.booking.enums.BookingStatus;
import com.bookmyvenue.server.booking.repository.BookingRepository;
import com.bookmyvenue.server.common.exception.BusinessException;
import com.bookmyvenue.server.common.exception.ErrorCode;
import com.bookmyvenue.server.slot.entity.SlotTemplate;
import com.bookmyvenue.server.slot.repository.SlotTemplateRepository;
import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvailabilityServiceImpl
        implements AvailabilityService {

    private final VenueRepository venueRepository;
    private final SlotTemplateRepository slotTemplateRepository;
    private  final BookingRepository bookingRepository;

    @Override
    public List<AvailabilityResponse> getAvailability(
            Long venueId,
            LocalDate date
    ) {
        log.info(
                "Fetching availability for venueId={} date={}",
                venueId,
                date
        );
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new BusinessException(
                                ErrorCode.VENUE_NOT_FOUND
                        ));

        DayOfWeek dayOfWeek = date.getDayOfWeek();

        // Get all configured slots for the selected day
        List<SlotTemplate> templates =
                slotTemplateRepository
                        .findByVenueIdAndDayOfWeek(
                                venue.getId(),
                                dayOfWeek
                        );

        // Active bookings block slot availability
        List<Booking> activeBookings =
                bookingRepository
                        .findByVenueIdAndBookingDateAndStatusIn(
                                venueId,
                                date,
                                List.of(
                                        BookingStatus.PENDING,
                                        BookingStatus.CONFIRMED
                                )
                        );

        // Collect booked slot template ids for filtering
        Set<Long> bookedTemplateIds =
                activeBookings.stream()
                        .map(booking ->
                                booking.getSlotTemplate().getId()
                        )
                        .collect(Collectors.toSet());

        log.info(
                "Found {} configured slots and {} active bookings for venueId={} date={}",
                templates.size(),
                activeBookings.size(),
                venueId,
                date
        );

        return templates.stream()
                .filter(template ->
                        !bookedTemplateIds.contains(
                                template.getId()
                        )
                )
                .map(template ->
                        new AvailabilityResponse(
                                template.getId(),
                                template.getStartTime(),
                                template.getEndTime()
                        )
                )
                .toList();
    }
}