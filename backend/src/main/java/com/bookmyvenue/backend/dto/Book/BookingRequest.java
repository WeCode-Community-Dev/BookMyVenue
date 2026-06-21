package com.bookmyvenue.backend.dto.Book;

import com.bookmyvenue.backend.enums.BookingStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {
    private Long venueId;

    private Long userId;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer guestCount;

    private String remarks;

    private BookingStatus bookingStatus;

}
