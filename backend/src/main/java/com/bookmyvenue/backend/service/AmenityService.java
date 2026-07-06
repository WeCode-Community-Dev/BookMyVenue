package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.venueAmenity.AmenityRequest;
import com.bookmyvenue.backend.dto.venueAmenity.AmenityResponse;

import java.util.List;

public interface AmenityService {

    AmenityResponse createAmenity(AmenityRequest request);

    AmenityResponse getAmenityById(Long id);

    List<AmenityResponse> getAllAmenities();

    AmenityResponse updateAmenity(Long id,
                                     AmenityRequest request);
    void deleteAmenity(Long id);



}