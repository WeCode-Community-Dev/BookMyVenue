package com.bookmyvenue.backend.mapper;

import com.bookmyvenue.backend.dto.venuAvailability.VenueAvailabilityRequest;
import com.bookmyvenue.backend.dto.venuAvailability.VenueAvailabilityResponse;
import com.bookmyvenue.backend.entity.VenueAvailability;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface VenuAvailabilityMapper {

    VenueAvailability toEntity(VenueAvailabilityRequest request );

    VenueAvailabilityResponse toResponse(VenueAvailability response);
}