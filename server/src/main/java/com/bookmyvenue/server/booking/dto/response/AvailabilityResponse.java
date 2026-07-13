package com.bookmyvenue.server.booking.dto.response;

import java.time.LocalTime;

public record AvailabilityResponse(
        Long slotTemplateId,
        LocalTime startTime,
        LocalTime endTime
) {
}