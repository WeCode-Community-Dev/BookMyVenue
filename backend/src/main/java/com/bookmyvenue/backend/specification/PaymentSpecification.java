package com.bookmyvenue.backend.specification;

import com.bookmyvenue.backend.entity.Payment;
import com.bookmyvenue.backend.enums.PaymentStatus;
import com.bookmyvenue.backend.enums.PaymentType;
import org.springframework.data.jpa.domain.Specification;

public class PaymentSpecification {

    public static Specification<Payment> hasBookingId(Long bookingId) {
        return (root, query, cb) ->
                bookingId == null ? cb.conjunction()
                        : cb.equal(root.get("booking").get("bookingId"), bookingId);
    }

    public static Specification<Payment> hasStatus(PaymentStatus status) {
        return (root, query, cb) ->
                status == null ? cb.conjunction()
                        : cb.equal(root.get("paymentStatus"), status);
    }

    public static Specification<Payment> hasType(PaymentType type) {
        return (root, query, cb) ->
                type == null ? cb.conjunction()
                        : cb.equal(root.get("paymentType"), type);
    }
}