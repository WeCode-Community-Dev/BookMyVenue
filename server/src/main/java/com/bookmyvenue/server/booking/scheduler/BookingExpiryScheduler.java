package com.bookmyvenue.server.booking.scheduler;

import com.bookmyvenue.server.booking.entity.Booking;
import com.bookmyvenue.server.booking.enums.BookingStatus;
import com.bookmyvenue.server.booking.repository.BookingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingExpiryScheduler {

    private final BookingRepository bookingRepository;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireBookings() {

        List<Booking> expiredBookings =
                bookingRepository
                        .findByStatusAndExpiresAtBefore(
                                BookingStatus.PENDING,
                                LocalDateTime.now()
                        );

        expiredBookings.forEach(
                booking ->
                        booking.setStatus(
                                BookingStatus.EXPIRED
                        )
        );

        bookingRepository.saveAll(expiredBookings);

        if (!expiredBookings.isEmpty()) {
            log.info(
                    "Expired {} bookings",
                    expiredBookings.size()
            );
        }
    }
}