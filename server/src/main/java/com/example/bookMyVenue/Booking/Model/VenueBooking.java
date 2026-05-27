package com.example.bookMyVenue.Booking.Model;

import com.example.bookMyVenue.Enums.BookingPaymentStatus;
import com.example.bookMyVenue.Enums.BookingStatus;
import com.example.bookMyVenue.Auth.Model.PaymentDetail;
import com.example.bookMyVenue.Payment.Model.User;
import com.example.bookMyVenue.Venue.Model.Venue;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Table(name = "venue_booking")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VenueBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;
    private LocalDate bookingDate;
    private LocalTime bookingStart;
    private LocalTime bookingEnd;

    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    @Enumerated(EnumType.STRING)
    private BookingPaymentStatus bookingPaymentStatus;

    @OneToOne
    @JoinColumn(name="payment_detail_id")
    private PaymentDetail paymentDetail;

    private Double amount;
    private LocalDateTime createdAt;
}
