package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.venuAvailability.VenueAvailabilityResponse;
import com.bookmyvenue.backend.dto.venuAvailability.VenueAvailabilityRequest;

import java.util.List;

public interface VenueAvailabilityService {

    VenueAvailabilityResponse create(
            VenueAvailabilityRequest request);

    VenueAvailabilityResponse getById(Long id);

    List<VenueAvailabilityResponse> getAll();

    List<VenueAvailabilityResponse> getByVenueId(Long venueId);

    VenueAvailabilityResponse update(
            Long id,
            VenueAvailabilityRequest request);

    void delete(Long id);
}