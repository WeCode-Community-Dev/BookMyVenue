package com.bookmyvenue.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookmyvenue.dto.VenueRequest;
import com.bookmyvenue.dto.VenueResponse;
import com.bookmyvenue.dto.VenueUpdateRequest;
import com.bookmyvenue.model.User;
import com.bookmyvenue.model.Venues;
import com.bookmyvenue.repository.UserRepository;
import com.bookmyvenue.repository.VenueRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OwnerService {
    public final VenueRepository venueRepository;
    private final UserRepository userRepository;

    public VenueResponse createVenue(VenueRequest request, String userEmail ){
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

        if(user.getRole() != User.Role.owner){
            throw new org.springframework.security.access.AccessDeniedException("Only owner can register venues");
        }

        Venues venues = Venues.builder()
            .venueName(request.getVenueName())
            .venueType(request.getVenueType())
            .location(request.getLocation())
            .venueDescription(request.getVenueDescription())
            .capacity(request.getCapacity())
            .price(request.getPrice())
            .parkingAvailable(request.getParkingAvailable())
            .imageUrl(request.getImageUrl())
            .termsAccepted(request.getTermsAccepted())
            .user(user)
            .build();

        Venues saved = venueRepository.save(venues);
        // return new VenueResponse(venues.getVenueName(),venues.getVenueType().name(), venues.getLocation(), venues.getVenueDescription(), venues.getCapacity(), venues.getPrice(), venues.getParkingAvailable().name(), venues.getImageUrl(), venues.getTermsAccepted());
        return VenueResponse.from(saved);

    }

    public List<VenueResponse> getMyVenues(String ownerEmail){
        User owner = userRepository.findByEmail(ownerEmail).orElseThrow(()-> new RuntimeException("User not found"));

        return venueRepository.findByUserId(owner.getId()).stream().map(VenueResponse::from).collect(Collectors.toList());
    }

    public VenueResponse updateVenue(Integer venueId, VenueUpdateRequest request, String ownerEmail){
        Venues venue = venueRepository.findById(venueId).orElseThrow(()->new RuntimeException("venue not found with ID" + venueId));

        if (!venue.getUser().getEmail().equals(ownerEmail)){
            throw new org.springframework.security.access.AccessDeniedException("you are not allowed to edit this venue");
        }

        if(request.getVenueName() != null) venue.setVenueName(request.getVenueName());
        if(request.getVenueType() != null) venue.setVenueType(request.getVenueType());
        if(request.getLocation() != null) venue.setLocation(request.getLocation());
        if(request.getVenueDescription() != null) venue.setVenueDescription(request.getVenueDescription());
        if(request.getCapacity() != null) venue.setCapacity(request.getCapacity());
        if(request.getPrice() != null) venue.setPrice(request.getPrice());
        if(request.getParkingAvailable() != null) venue.setParkingAvailable(request.getParkingAvailable());
        if(request.getImageUrl() != null) venue.setImageUrl(request.getImageUrl());

        venue.setStatus(Venues.VenueStatus.PENDING);

        Venues updated = venueRepository.save(venue);

        return VenueResponse.from(updated);
    }

    public void deleteVenue(Integer venueId, String ownerEmail){
        Venues venue = venueRepository.findById(venueId).orElseThrow(()-> new RuntimeException("Venue not found with Id:"+ venueId));

        if (!venue.getUser().getEmail().equals(ownerEmail)){
            throw new org.springframework.security.access.AccessDeniedException("you are not allowed to delete this venue");
        }

        venueRepository.deleteById(venueId);
    }
    
}
