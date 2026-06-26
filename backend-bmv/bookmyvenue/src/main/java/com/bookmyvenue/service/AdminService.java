package com.bookmyvenue.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookmyvenue.dto.BookingResponse;
import com.bookmyvenue.dto.UserResponse;
import com.bookmyvenue.dto.UserStatusRequest;
import com.bookmyvenue.dto.VenueResponse;
import com.bookmyvenue.dto.VenueReviewRequest;
import com.bookmyvenue.model.User;
import com.bookmyvenue.model.Venues;
import com.bookmyvenue.repository.BookingRepository;
import com.bookmyvenue.repository.UserRepository;
import com.bookmyvenue.repository.VenueRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final BookingRepository bookingRepository;


    public List<UserResponse> getAllUsers(){
        return userRepository.findAll().stream().map(UserResponse::from).collect(Collectors.toList());
    }

    public List<VenueResponse> getAllPendingReviews(){
        return venueRepository.findByStatus(Venues.VenueStatus.PENDING).stream().map(VenueResponse::from).collect(Collectors.toList());
    }

    public UserResponse updateUserStatus(Integer userId, UserStatusRequest request){
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));

        user.setActive(request.getActive());
        userRepository.save(user);

        return UserResponse.from(user);
    }

    public VenueResponse reviewVenue(Integer venueId, VenueReviewRequest request){

        Venues venue = venueRepository.findById(venueId).orElseThrow(()-> new RuntimeException("Venue Not Found:" + venueId));

        if(venue.getStatus() != Venues.VenueStatus.PENDING){
            throw new RuntimeException("Venue is alredy "+venue.getStatus());
        }

        venue.setStatus(Venues.VenueStatus.valueOf(request.getStatus()));

        venue.setApproverMessage(request.getApproverMessage());

        venue.setApprovedOn(LocalDateTime.now());

        venueRepository.save(venue);
        return VenueResponse.from(venue);
    }

    public List<BookingResponse> getAllBookings(){
        return bookingRepository.findAll().stream().map(BookingResponse::from).collect(Collectors.toList());
    }

    public List<VenueResponse> getAllVenues(){
        return venueRepository.findAll().stream().map(VenueResponse::from).collect(Collectors.toList());
    }
}
