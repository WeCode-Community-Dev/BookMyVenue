package com.bookmyvenue.backend.specification;

import com.bookmyvenue.backend.entity.Booking;
import com.bookmyvenue.backend.enums.BookingStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class BookingSpecification {

    public static Specification<Booking> hasVenue(Long venueId) {
        return (root, query, cb) ->
                venueId == null
                        ? cb.conjunction()
                        : cb.equal(root.get("venue").get("venueId"), venueId);
    }

    public static Specification<Booking> hasUser(Long userId) {
        return (root, query, cb) ->
                userId == null
                        ? cb.conjunction()
                        : cb.equal(root.get("user").get("userId"), userId);
    }

    public static Specification<Booking> hasStatus(BookingStatus status) {
        return (root, query, cb) ->
                status == null
                        ? cb.conjunction()
                        : cb.equal(root.get("bookingStatus"), status);
    }

    public static Specification<Booking> hasBookingDate(LocalDate bookingDate) {
        return (root, query, cb) ->
                bookingDate == null
                        ? cb.conjunction()
                        : cb.equal(root.get("bookingDate"), bookingDate);
    }

    public static Specification<Booking> betweenDates(LocalDate fromDate, LocalDate toDate) {
        return (root, query, cb) -> {
            if (fromDate == null || toDate == null) {
                return cb.conjunction();
            }
            return cb.between(root.get("bookingDate"), fromDate, toDate);
        };
    }

    // ⭐ NEW: clean builder method (recommended)
    public static Specification<Booking> build(
            Long venueId,
            Long userId,
            BookingStatus status,
            LocalDate bookingDate
    ) {
        return Specification.where(hasVenue(venueId))
                .and(hasUser(userId))
                .and(hasStatus(status))
                .and(hasBookingDate(bookingDate));
    }
}