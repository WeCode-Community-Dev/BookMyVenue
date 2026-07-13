package com.bookmyvenue.server;

import com.bookmyvenue.server.booking.entity.Booking;
import com.bookmyvenue.server.booking.enums.BookingStatus;
import com.bookmyvenue.server.booking.repository.BookingRepository;
import com.bookmyvenue.server.slot.entity.SlotTemplate;
import com.bookmyvenue.server.slot.repository.SlotTemplateRepository;
import com.bookmyvenue.server.user.entity.User;
import com.bookmyvenue.server.user.repository.UserRepository;
import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.repository.VenueRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class BookingConcurrencyTest {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private SlotTemplateRepository slotTemplateRepository;

    @Test
    void shouldPreventDoubleBooking() throws Exception {

        Venue venue =
                venueRepository.findById(1L)
                        .orElseThrow();

        SlotTemplate slotTemplate =
                slotTemplateRepository.findById(1L)
                        .orElseThrow();

        User user =
                userRepository.findAll()
                        .getFirst();

        LocalDate bookingDate =
                LocalDate.of(2026, 6, 23);

        int threadCount = 100;

        ExecutorService executorService =
                Executors.newFixedThreadPool(threadCount);

        CountDownLatch startLatch =
                new CountDownLatch(1);

        CountDownLatch finishLatch =
                new CountDownLatch(threadCount);

        AtomicInteger successCount =
                new AtomicInteger();

        AtomicInteger failureCount =
                new AtomicInteger();

        for (int i = 0; i < threadCount; i++) {

            executorService.submit(() -> {

                try {

                    startLatch.await();

                    Booking booking = Booking.builder()
                            .user(user)
                            .venue(venue)
                            .slotTemplate(slotTemplate)
                            .bookingDate(bookingDate)
                            .status(BookingStatus.PENDING)
                            .totalAmount(venue.getPricePerSlot())
                            .expiresAt(
                                    LocalDateTime.now()
                                            .plusMinutes(10)
                            )
                            .build();

                    bookingRepository.saveAndFlush(
                            booking
                    );

                    successCount.incrementAndGet();

                } catch (Exception e) {

                    failureCount.incrementAndGet();

                } finally {

                    finishLatch.countDown();

                }
            });
        }

        startLatch.countDown();

        finishLatch.await();

        executorService.shutdown();

        System.out.println(
                "Success Count = "
                        + successCount.get()
        );

        System.out.println(
                "Failure Count = "
                        + failureCount.get()
        );

        assertEquals(
                1,
                successCount.get()
        );
    }
}