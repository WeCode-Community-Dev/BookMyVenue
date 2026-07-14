package com.bookmyvenue.backend.dto.Book;

import com.bookmyvenue.backend.enums.BookingStatus;
import lombok.Data;

@Data
public class BookingStatusRequest {

    private String remarks;

    private Long updatedBy;

    private BookingStatus bookingStatus;

    private String cancellationReason;

    private String cancelledBy;
}
