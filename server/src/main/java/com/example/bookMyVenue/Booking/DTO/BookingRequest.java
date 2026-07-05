package com.example.bookMyVenue.Booking.DTO;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {

    @NotNull
    private Long venueId;

    @NotEmpty
    private List<BookingSlotRequest> slots;
}
