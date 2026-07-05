package com.example.bookMyVenue.Booking.DTO;

import com.example.bookMyVenue.Venue.Enums.DurationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class VenueSlotsResponse {
    private Long venueId;
    private LocalDate date;
    private DurationType durationType;
    private List<SlotResponse> slots;
}
