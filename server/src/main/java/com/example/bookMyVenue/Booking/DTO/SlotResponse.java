package com.example.bookMyVenue.Booking.DTO;

import com.example.bookMyVenue.Booking.Enums.SlotStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;


@Builder
@Data
public class SlotResponse {
    private LocalTime startTime;
    private LocalTime endTime;
    private SlotStatus status;
    private String reason;
    private BigDecimal rate;
}
