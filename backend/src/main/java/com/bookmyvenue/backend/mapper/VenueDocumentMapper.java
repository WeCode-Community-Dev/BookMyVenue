package com.bookmyvenue.backend.mapper;

import com.bookmyvenue.backend.dto.venueAmenity.AmenityRequest;
import com.bookmyvenue.backend.dto.venueAmenity.AmenityResponse;
import com.bookmyvenue.backend.dto.venueDocument.VenueDocumentRequest;
import com.bookmyvenue.backend.dto.venueDocument.VenueDocumentResponse;
import com.bookmyvenue.backend.entity.Amenity;
import com.bookmyvenue.backend.entity.VenueDocument;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VenueDocumentMapper {

    VenueDocument toEntity(VenueDocumentRequest request );

    VenueDocumentResponse toResponse(VenueDocument response);
}