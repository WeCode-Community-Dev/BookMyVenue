package com.bookmyvenue.dto;

import java.time.LocalDateTime;

import com.bookmyvenue.model.BookingCancellation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CancellationResponse {
    private Integer id;
    private Integer bookingId;
    private String  venueName;
    private String  venueLocation;
    private String  bookingDate;
    private String  reason;
    private String  status;
    private String  ownerResponse;
    private String  cancelledBy;
    private LocalDateTime createdOn;
    private LocalDateTime reviewedOn;
    private String  bookingStatus;
    private String  paymentStatus;

    public static CancellationResponse from(BookingCancellation bc) {
        return CancellationResponse.builder()
                .id(bc.getId())
                .bookingId(bc.getBooking().getId())
                .venueName(bc.getBooking().getVenue().getVenueName())
                .venueLocation(bc.getBooking().getVenue().getLocation())
                .bookingDate(bc.getBooking().getBookingDate().toString())
                .reason(bc.getReason())
                .status(bc.getStatus().name())
                .ownerResponse(bc.getOwnerResponse())
                .cancelledBy(bc.getCancelledBy().name())
                .createdOn(bc.getCreatedOn())
                .reviewedOn(bc.getReviewedOn())
                .bookingStatus(bc.getBooking().getBookingStatus().name())
                .paymentStatus(bc.getBooking().getPaymentStatus().name())
                .build();
    }
}
