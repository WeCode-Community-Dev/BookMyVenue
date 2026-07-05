package com.example.bookMyVenue.Booking.DTO;

import com.example.bookMyVenue.Booking.Enums.BookingStatus;
import com.example.bookMyVenue.Venue.Enums.DurationType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long venueId;
    private String venueName;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private DurationType durationType;
    private BookingStatus status;
    private BigDecimal appliedRate;
    private String eventPurpose;
    private LocalDateTime createdAt;
}
