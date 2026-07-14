package com.bookmyvenue.backend.dto.Book;


import com.bookmyvenue.backend.enums.BookingStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Data
public class BookingResponse {

    private Long bookingId;

    private Long venueId;

    private String venueName;

    private Long userId;

    private String userName;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer guestCount;

    private BigDecimal totalAmount;

    private BigDecimal advanceAmount;

    private BookingStatus bookingStatus;

    private String remarks;

    private LocalDateTime createdAt;
}
