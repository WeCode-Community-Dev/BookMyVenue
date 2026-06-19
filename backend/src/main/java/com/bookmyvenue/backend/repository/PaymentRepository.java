package com.bookmyvenue.backend.repository;

import com.bookmyvenue.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    @Query("""
           SELECT COALESCE(SUM(p.totalAmount), 0)
           FROM Payment p
           WHERE p.booking.venue.ownerUser.userId = :ownerId
           AND p.paymentStatus = com.bookmyvenue.backend.enums.PaymentStatus.SUCCESS
           """)
    BigDecimal getRevenueByOwnerId(
            @Param("ownerId") Long ownerId);
}