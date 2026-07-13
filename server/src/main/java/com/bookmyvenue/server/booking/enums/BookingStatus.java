package com.bookmyvenue.server.booking.enums;

public enum BookingStatus {

    PENDING,     // Reserved, waiting for advance payment
    CONFIRMED,   // Advance payment successful
    CANCELLED,   // Cancelled by user/admin
    EXPIRED   // Reservation timeout
}