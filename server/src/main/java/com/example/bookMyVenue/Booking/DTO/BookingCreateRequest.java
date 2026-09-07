package com.example.bookMyVenue.Booking.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingCreateRequest {
    @NotNull
    private LocalDate bookingDate;

    private LocalTime startTime;
    private LocalTime endTime;

    private String eventPurpose;
}
