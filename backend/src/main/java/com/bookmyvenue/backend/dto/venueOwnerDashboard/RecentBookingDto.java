package com.bookmyvenue.backend.dto.venueOwnerDashboard;

import com.bookmyvenue.backend.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class RecentBookingDto {

    private String guestName;

    private String venueName;

    private LocalDate bookingDate;

    private BigDecimal amount;

    private BookingStatus status;
}