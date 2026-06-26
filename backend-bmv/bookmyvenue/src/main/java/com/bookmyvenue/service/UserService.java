package com.bookmyvenue.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookmyvenue.dto.BookingRequest;
import com.bookmyvenue.dto.BookingResponse;
import com.bookmyvenue.exception.VenueAlredyBookedException;
import com.bookmyvenue.model.Booking;
import com.bookmyvenue.model.Booking.BookingStatus;
import com.bookmyvenue.model.User;
import com.bookmyvenue.model.Venues;
import com.bookmyvenue.repository.BookingRepository;
import com.bookmyvenue.repository.UserRepository;
import com.bookmyvenue.repository.VenueRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;

    public List<com.bookmyvenue.dto.VenueResponse> getApprovedVenues(){
        return venueRepository.findByStatus(Venues.VenueStatus.APPROVED).stream().map(com.bookmyvenue.dto.VenueResponse::from).collect(Collectors.toList());

    }
    
    public BookingResponse createBooking(BookingRequest request, String userEmail){
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        Venues venue = venueRepository.findById(request.getVenueId()).orElseThrow(()-> new RuntimeException("Venue not found"));

        if(venue.getStatus() != Venues.VenueStatus.APPROVED){
            throw new RuntimeException("This venue is not availble for boooking currently !!!");
        }

        boolean alredyBooked = bookingRepository.existsByVenueIdAndBookingDateAndBookingStatusIn(venue.getId(), request.getBookingDate(),List.of(BookingStatus.PENDING, BookingStatus.APPROVED));

        if(alredyBooked){
            throw new VenueAlredyBookedException("");
        }

        Booking booking = Booking.builder()
                .user(user)
                .venue(venue)
                .bookingDate(request.getBookingDate())
                .build();

        Booking saved = bookingRepository.save(booking);
        return BookingResponse.from(saved);

    }

    public List<BookingResponse> getMyBookings(String userEmail){
        User user = userRepository.findByEmail(userEmail).orElseThrow(()->new  RuntimeException("User not found"));

        return bookingRepository.findByUserId(user.getId()).stream().map(BookingResponse::from).collect(Collectors.toList());
    }
}
