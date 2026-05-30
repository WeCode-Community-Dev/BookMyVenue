package com.example.bookMyVenue.Venue.Service;

import com.example.bookMyVenue.Venue.DTO.VenueAvailabilityRulesRequest;
import com.example.bookMyVenue.Venue.Model.Venue;
import com.example.bookMyVenue.Venue.Model.VenueAvailabilityRules;
import com.example.bookMyVenue.Venue.Repository.VenueAvailabilityRulesRepo;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class VenueAvailabilityRulesService {

    private final VenueAvailabilityRulesRepo venueAvailabilityRulesRepo;
    private final OwnerVenueService ownerVenueService;

    public VenueAvailabilityRules createAvailabilityRules( VenueAvailabilityRulesRequest venueAvailabilityRulesRequest) {
        Venue venue = ownerVenueService.getVenueById(venueAvailabilityRulesRequest.getVenueId());
        return venueAvailabilityRulesRepo.save(mapToVenueAvailabilityRules(venueAvailabilityRulesRequest,venue));
    }

    private VenueAvailabilityRules mapToVenueAvailabilityRules(VenueAvailabilityRulesRequest venueAvailabilityRulesRequest ,Venue venue) {
        return VenueAvailabilityRules.builder()
                .venue(venue)
                .venueOpeningTime(venueAvailabilityRulesRequest.getVenueOpeningTime())
                .VenueClosingTime(venueAvailabilityRulesRequest.getVenueClosingTime())
                .weekStartDay(venueAvailabilityRulesRequest.getWeekStartDay())
                .weekEndDay(venueAvailabilityRulesRequest.getWeekEndDay())
                .minDuration(venueAvailabilityRulesRequest.getMinDuration())
                .bookBefore(venueAvailabilityRulesRequest.getBookBefore())
                .isCurrentlyActive(setActiveStatus(venueAvailabilityRulesRequest.isCurrentlyActive(),venue))
                .build();
    }


    public boolean setActiveStatus(Boolean clientRequest,Venue venue){
        if(!clientRequest) {
            return !isVenueAvailabilityRuleExist(venue);
        }
        return clientRequest;
    }
    public boolean isVenueAvailabilityRuleExist(Venue venue){
       return !venueAvailabilityRulesRepo.existsByVenue(venue);
    }
}
