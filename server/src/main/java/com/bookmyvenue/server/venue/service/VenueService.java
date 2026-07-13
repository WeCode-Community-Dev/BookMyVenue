package com.bookmyvenue.server.venue.service;

import com.bookmyvenue.server.venue.dto.request.CreateVenueRequest;
import com.bookmyvenue.server.venue.dto.request.UpdateVenueRequest;
import com.bookmyvenue.server.venue.dto.response.VenueResponse;

import java.util.List;
import java.util.UUID;

public interface VenueService {

    VenueResponse createVenue(CreateVenueRequest request);

    List<VenueResponse> getAllVenues();

    VenueResponse getVenue(Long venueId);

    List<VenueResponse> getApprovedVenues(String keyword, String district,Long categoryId);

    VenueResponse getApprovedVenue(Long id);

    VenueResponse updateVenue(Long venueId, UpdateVenueRequest request);

    void deleteVenue(Long venueId);

}
