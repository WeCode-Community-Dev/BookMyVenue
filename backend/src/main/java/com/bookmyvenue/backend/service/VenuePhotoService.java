package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.venuePhoto.VenuePhotoRequest;
import com.bookmyvenue.backend.dto.venuePhoto.VenuePhotoResponse;

import java.util.List;

public interface VenuePhotoService {

    VenuePhotoResponse create(VenuePhotoRequest request);

    VenuePhotoResponse getById(Long photoId);

    public List<VenuePhotoResponse> getAllPhotoByVenueId(Long venueId);

    VenuePhotoResponse update(Long photoId,
                                 VenuePhotoRequest request);

    void delete(Long photoId);
}