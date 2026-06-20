package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.Venue.*;
import com.bookmyvenue.backend.enums.VenueStatus;

import java.util.List;

public interface VenueService {

    VenueCreationResponse createVenue(VenueCreationRequest request);

    VenueCreationResponse getVenueById(Long venueId);

    List<VenueCreationResponse> getAllVenues();

    VenueCreationResponse updateVenue(Long venueId,
                                      VenueCreationRequest request);

    void deleteVenue(Long venueId);

    public List<VenueCreationResponse> searchVenues(
            VenueSearchRequest request);

    List<VenueCreationResponse> getVenuesByOwner(Long ownerId);

    List<VenueCreationResponse> getVenuesByStatus(VenueStatus status);

    VenueCreationResponse updateVenueStatus(
            Long venueId,
            VenueStatusRequest request);
}