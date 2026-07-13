package com.bookmyvenue.server.booking.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record BookingRequest(
        @NotNull
        LocalDate bookingDate,

        @NotNull
        @Min(1)
        Integer guestCount
) {

}
