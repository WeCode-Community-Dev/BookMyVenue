package com.bookmyvenue.server.slot.dto.request;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record CreateSlotTemplateRequest(
        DayOfWeek dayOfWeek,
        LocalTime startTime,
        LocalTime endTime
) {
}