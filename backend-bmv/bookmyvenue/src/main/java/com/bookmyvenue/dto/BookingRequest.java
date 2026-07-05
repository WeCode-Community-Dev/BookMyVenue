package com.bookmyvenue.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class BookingRequest {
   private Integer venueId;
   private LocalDate bookingDate; 
}
