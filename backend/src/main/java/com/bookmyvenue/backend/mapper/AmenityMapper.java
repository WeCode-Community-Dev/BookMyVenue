package com.bookmyvenue.backend.mapper;

import com.bookmyvenue.backend.dto.venueAmenity.AmenityRequest;
import com.bookmyvenue.backend.dto.venueAmenity.AmenityResponse;
import com.bookmyvenue.backend.entity.Amenity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AmenityMapper {

    Amenity toEntity(AmenityRequest request );

    AmenityResponse toResponse(Amenity response);
}