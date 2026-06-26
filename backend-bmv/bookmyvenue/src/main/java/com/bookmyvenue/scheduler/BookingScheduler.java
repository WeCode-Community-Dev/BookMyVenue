package com.bookmyvenue.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.bookmyvenue.model.Booking;
import com.bookmyvenue.repository.BookingRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingScheduler {
    private final BookingRepository bookingRepository;

    @Scheduled(cron= "0 0 0 * * *")
    @Transactional
    public void autoRejectExpiredBooking(){
        //testing 2 min
        // LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(2);
        LocalDateTime cutoffTime = LocalDateTime.now().minusDays(2);
        log.info("Running auto-reject job. cutoff time ; {}",cutoffTime);

        List<Booking> expiredBookings = bookingRepository.findPendingBookingsOlderThan(cutoffTime);

        if(expiredBookings.isEmpty()){
            log.info("No exiped bookings found.");
            return;
        }

        log.info("Found {} expired pending bookings. Auto-rejecting....",expiredBookings.size());

        for(Booking booking : expiredBookings){
            booking.setBookingStatus(Booking.BookingStatus.REJECTED);
            booking.setOwnerComments("Auto Rejected: the venue owner did not respond with in 2 days."+"Please try booking again or choose a differnt venue.");
            booking.setReviewedOn(LocalDateTime.now());
            bookingRepository.save(booking);
            
            log.info("Auto-rejected booking is={} for venue={} on date={}",booking.getId(),booking.getVenue().getVenueName(),booking.getBookingDate());

        }
        log.info("Auto-reject job completed.{} bookings rejected",expiredBookings.size());
    }
}
