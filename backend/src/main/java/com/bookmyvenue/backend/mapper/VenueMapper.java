package com.bookmyvenue.backend.mapper;

import com.bookmyvenue.backend.dto.Venue.VenueRequest;
import com.bookmyvenue.backend.dto.Venue.VenueResponse;
import com.bookmyvenue.backend.entity.Amenity;
import com.bookmyvenue.backend.entity.Venue;
import org.mapstruct.Mapper;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface VenueMapper {

    Venue toEntity(VenueRequest request );

    VenueResponse toResponse(Venue venue);

    default Set<String> mapAmenities(Set<Amenity> amenities) {
        if (amenities == null) return null;
        return amenities.stream()
                .map(Amenity::getAmenityName)
                .collect(Collectors.toSet());
    }

}