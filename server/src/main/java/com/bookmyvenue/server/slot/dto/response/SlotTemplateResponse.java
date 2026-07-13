package com.bookmyvenue.server.slot.dto.response;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record SlotTemplateResponse(

        Long id,

        DayOfWeek dayOfWeek,

        LocalTime startTime,

        LocalTime endTime,

        boolean active

) {
}
