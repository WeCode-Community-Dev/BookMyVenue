package com.bookmyvenue.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.bookmyvenue.model.Booking;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BookingResponse {
    private Integer id;
    private Integer venueId;
    private String  venueName;
    private String  venueLocation;
    private LocalDate bookingDate;
    private String  bookingStatus;
    private String  paymentStatus;
    private String  ownerComments;
    private LocalDateTime reviewedOn;
    private LocalDateTime bookedOn;
    private String customerName;
    private String customerEmail;

    public static BookingResponse from(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .venueId(booking.getVenue().getId())
                .venueName(booking.getVenue().getVenueName())
                .venueLocation(booking.getVenue().getLocation())
                .bookingDate(booking.getBookingDate())
                .bookingStatus(booking.getBookingStatus().name())
                .paymentStatus(booking.getPaymentStatus().name())
                .ownerComments(booking.getOwnerComments())
                .reviewedOn(booking.getReviewedOn())
                .bookedOn(booking.getBookedOn())
                .customerName(booking.getUser().getName())
                .customerEmail(booking.getUser().getEmail())
                .build();
    }
}
