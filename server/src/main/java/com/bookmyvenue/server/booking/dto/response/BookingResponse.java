package com.bookmyvenue.server.booking.dto.response;

import com.bookmyvenue.server.booking.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        Long venueId,
        Long slotTemplateId,
        LocalDate bookingDate,
        BookingStatus status,
        Integer guestCount,
        BigDecimal totalAmount,
        LocalDateTime expiresAt
) {
}
