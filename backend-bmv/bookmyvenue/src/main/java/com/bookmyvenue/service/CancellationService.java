package com.bookmyvenue.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.bookmyvenue.dto.CancelRequest;
import com.bookmyvenue.dto.CancelReviewRequest;
import com.bookmyvenue.dto.CancellationResponse;
import com.bookmyvenue.model.Booking;
import com.bookmyvenue.model.BookingCancellation;
import com.bookmyvenue.model.BookingCancellation.CancellationStatus;
import com.bookmyvenue.model.User;
import com.bookmyvenue.repository.BookingCancellationRepository;
import com.bookmyvenue.repository.BookingRepository;
import com.bookmyvenue.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.model.Refund;
import com.stripe.param.RefundCreateParams;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CancellationService {
   private final BookingRepository bookingRepository;
    private final BookingCancellationRepository cancellationRepository;
    private final UserRepository userRepository;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

     // USER: submit cancel request
    @Transactional
    public CancellationResponse requestCancellation(Integer bookingId, CancelRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        // Only the booking owner can cancel
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only cancel your own bookings");
        }

        // Only PENDING or APPROVED bookings can be cancelled
        if (booking.getBookingStatus() == Booking.BookingStatus.CANCELLED ||
            booking.getBookingStatus() == Booking.BookingStatus.REJECTED) {
            throw new RuntimeException("This booking cannot be cancelled");
        }

        // Check if cancel request already exists
        cancellationRepository.findByBookingId(bookingId).ifPresent(existing -> {
            if(existing.getStatus() == CancellationStatus.PENDING){
            throw new RuntimeException("A cancellation request already exists for this booking");
            }
        });

        BookingCancellation cancellation = cancellationRepository 
            .findByBookingId(bookingId) 
            .map(existing -> { existing.setReason(request.getReason()); 
            existing.setStatus(CancellationStatus.PENDING); 
            existing.setOwnerResponse(null); 
            existing.setReviewedOn(null); 
            existing.setCreatedOn(LocalDateTime.now()); 
        return existing; }) 
            .orElseGet(() -> BookingCancellation.builder() 
            .booking(booking) .reason(request.getReason()) 
            .cancelledBy(BookingCancellation.CancelledBy.USER) 
            .status(CancellationStatus.PENDING) 
            .build() );

        BookingCancellation saved = cancellationRepository.save(cancellation);
        return CancellationResponse.from(saved);
    }
 
    //OWNER: get all cancel requests for their venues
    public Page<CancellationResponse> getCancelRequestsForOwner(String ownerEmail, Pageable pageable) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cancellationRepository.findByVenueOwnerId(owner.getId(),pageable)
                .map(CancellationResponse::from);
    }
    
//OWNER: approve or reject cancel request
@Transactional
public CancellationResponse reviewCancellation(
        Integer cancellationId,
        CancelReviewRequest request,
        String ownerEmail) {

    User owner = userRepository.findByEmail(ownerEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

    BookingCancellation cancellation = cancellationRepository.findById(cancellationId)
            .orElseThrow(() -> new RuntimeException("Cancellation request not found"));

    // Make sure this cancel request belongs to this owners venue
    if (!cancellation.getBooking().getVenue().getUser().getId().equals(owner.getId())) {
        throw new AccessDeniedException("You cannot review this cancellation request");
    }

    // Only PENDING requests can be reviewed
    if (cancellation.getStatus() != CancellationStatus.PENDING) {
        throw new RuntimeException("This request has already been reviewed");
    }

    cancellation.setStatus(CancellationStatus.valueOf(request.getStatus()));
    cancellation.setOwnerResponse(request.getOwnerResponse());
    cancellation.setReviewedOn(LocalDateTime.now());

    Booking booking = cancellation.getBooking();

    if ("APPROVED".equalsIgnoreCase(request.getStatus())) {

        // Cancel the booking
        booking.setBookingStatus(Booking.BookingStatus.CANCELLED);

        // If booking was PAID — issue Stripe refund
        if (booking.getPaymentStatus() == Booking.PaymentStatus.PAID) {
            try {
                issueStripeRefund(booking);
                booking.setPaymentStatus(Booking.PaymentStatus.REFUNDED);

                log.info("Refund issued for booking id={}", booking.getId());

            } catch (Exception e) {

                log.error(
                        "Stripe refund failed for booking id={}: {}",
                        booking.getId(),
                        e.getMessage());
            }
        }

        bookingRepository.save(booking);

    } else {

        // REJECTED — booking stays APPROVED, no changes to booking
        log.info("Cancellation rejected for booking id={}", booking.getId());
    }

    BookingCancellation reviewed = cancellationRepository.save(cancellation);

    return CancellationResponse.from(reviewed);
}
    // Stripe refund 
    private void issueStripeRefund(Booking booking) throws Exception {
        Stripe.apiKey = stripeSecretKey;
        if (booking.getPaymentIntentId() != null) {
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(booking.getPaymentIntentId())
                    .build();
            Refund refund = Refund.create(params);
            log.info("Stripe refund created: {}", refund.getId());
        } else {
            log.warn("No paymentIntentId stored for booking id={}, skipping Stripe refund",
                    booking.getId());
        }
    }
}
