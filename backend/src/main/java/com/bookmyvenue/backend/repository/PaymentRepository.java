package com.bookmyvenue.backend.repository;

import com.bookmyvenue.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    Optional<Payment>
    findByBookingBookingId(
            Long bookingId);

    List<Payment> findByBooking_BookingId(Long bookingId);
}