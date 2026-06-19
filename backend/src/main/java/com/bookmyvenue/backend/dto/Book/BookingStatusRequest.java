package com.bookmyvenue.backend.dto.Book;

import com.bookmyvenue.backend.enums.BookingStatus;
import lombok.Data;

@Data
public class BookingStatusRequest {

    private BookingStatus status;

    private String remarks;

    private Long updatedBy;
}
