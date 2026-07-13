package com.bookmyvenue.server.booking.service;

import com.bookmyvenue.server.auth.service.AuthenticatedUserService;
import com.bookmyvenue.server.booking.dto.request.BookingRequest;
import com.bookmyvenue.server.booking.dto.response.BookingResponse;
import com.bookmyvenue.server.booking.entity.Booking;
import com.bookmyvenue.server.booking.enums.BookingStatus;
import com.bookmyvenue.server.booking.repository.BookingRepository;
import com.bookmyvenue.server.common.exception.BusinessException;
import com.bookmyvenue.server.common.exception.ErrorCode;
import com.bookmyvenue.server.payment.enums.PaymentType;
import com.bookmyvenue.server.payment.service.PaymentService;
import com.bookmyvenue.server.slot.entity.SlotTemplate;
import com.bookmyvenue.server.slot.repository.SlotTemplateRepository;
import com.bookmyvenue.server.user.entity.User;
import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.repository.VenueRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final VenueRepository venueRepository;
    private final SlotTemplateRepository slotTemplateRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public BookingResponse createBooking(
            Long venueId,
            Long slotTemplateId,
            BookingRequest request
    ) {

        log.info(
                "Creating booking. venueId={}, slotTemplateId={}, date={}",
                venueId,
                slotTemplateId,
                request.bookingDate()
        );

        User currentUser =
                authenticatedUserService.getCurrentUser();

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new BusinessException(
                                ErrorCode.VENUE_NOT_FOUND
                        ));

        if (request.guestCount() > venue.getCapacity()) {

            throw new BusinessException(
                    ErrorCode.VENUE_CAPACITY_EXCEEDED
            );
        }

        BigDecimal totalAmount = venue.getPricePerSlot();

        BigDecimal advanceAmount =
                totalAmount
                        .multiply(
                                venue.getAdvancePercentage()
                        )
                        .divide(BigDecimal.valueOf(100));

        SlotTemplate slotTemplate =
                slotTemplateRepository.findById(slotTemplateId)
                        .orElseThrow(() ->
                                new BusinessException(
                                        ErrorCode.SLOT_TEMPLATE_NOT_FOUND
                                ));
        if (!slotTemplate.getVenue().getId().equals(venueId)) {
            throw new BusinessException(
                    ErrorCode.ACCESS_DENIED
            );
        }
        if (!slotTemplate.isActive()) {
            throw new BusinessException(
                    ErrorCode.SLOT_TEMPLATE_NOT_FOUND
            );
        }

        DayOfWeek bookingDay =
                request.bookingDate().getDayOfWeek();

        if (!slotTemplate.getDayOfWeek().equals(bookingDay)) {

            throw new BusinessException(
                    ErrorCode.INVALID_BOOKING_DATE
            );
        }


        boolean alreadyBooked =
                bookingRepository
                        .existsBySlotTemplateIdAndBookingDateAndStatusIn(
                                slotTemplateId,
                                request.bookingDate(),
                                List.of(
                                        BookingStatus.PENDING,
                                        BookingStatus.CONFIRMED
                                )
                        );

        if (alreadyBooked) {

            log.warn(
                    "Slot already booked. slotTemplateId={}, date={}",
                    slotTemplateId,
                    request.bookingDate()
            );

            throw new BusinessException(
                    ErrorCode.SLOT_ALREADY_BOOKED
            );
        }

        Booking booking = Booking.builder()
                .user(currentUser)
                .venue(venue)
                .slotTemplate(slotTemplate)
                .bookingDate(request.bookingDate())
                .status(BookingStatus.PENDING)
                .totalAmount(totalAmount)
                .guestCount(request.guestCount())
                .expiresAt(
                        LocalDateTime.now().plusMinutes(10)
                )
                .build();

        bookingRepository.save(booking);

        log.info(
                "Booking created successfully. bookingId={}",
                booking.getId()
        );


        return mapToResponse(booking);
    }

    @Override
    public List<BookingResponse> getMyBookings() {

        User currentUser =
                authenticatedUserService.getCurrentUser();

        return bookingRepository
                .findByUserId(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new BusinessException(
                                ErrorCode.BOOKING_NOT_FOUND
                        ));

        User currentUser =
                authenticatedUserService.getCurrentUser();

        if (!booking.getUser().getId()
                .equals(currentUser.getId())) {

            throw new BusinessException(
                    ErrorCode.ACCESS_DENIED
            );
        }

        booking.setStatus(
                BookingStatus.CANCELLED
        );

        bookingRepository.save(booking);

        log.info(
                "Booking cancelled. bookingId={}",
                bookingId
        );
    }

    @Override
    public List<BookingResponse> getVendorBookings(
            BookingStatus status,
            Long venueId
    ) {

        User vendor = authenticatedUserService.getCurrentUser();

        List<Booking> bookings = bookingRepository
                .findVendorBookings(
                        vendor.getId(),
                        status,
                        venueId
                );

        return bookings.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private BookingResponse mapToResponse(
            Booking booking
    ) {

        return new BookingResponse(
                booking.getId(),
                booking.getVenue().getId(),
                booking.getSlotTemplate().getId(),
                booking.getBookingDate(),
                booking.getStatus(),
                booking.getGuestCount(),
                booking.getTotalAmount(),
                booking.getExpiresAt()
        );
    }
}