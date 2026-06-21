package com.bookmyvenue.backend.mapper;

import com.bookmyvenue.backend.dto.Venue.VenueCreationRequest;
import com.bookmyvenue.backend.dto.Venue.VenueCreationResponse;
import com.bookmyvenue.backend.entity.Amenity;
import com.bookmyvenue.backend.entity.Venue;
import org.mapstruct.Mapper;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface VenueMapper {

    Venue toEntity(VenueCreationRequest request );

    VenueCreationResponse toResponse(Venue venue);

    default Set<String> mapAmenities(Set<Amenity> amenities) {
        if (amenities == null) return null;
        return amenities.stream()
                .map(Amenity::getAmenityName)
                .collect(Collectors.toSet());
    }

    default Set<String> mapCategories(Set<com.bookmyvenue.backend.entity.EventCategory> categories) {
        if (categories == null) return null;
        return categories.stream()
                .map(com.bookmyvenue.backend.entity.EventCategory::getEventCategoryName)
                .collect(Collectors.toSet());
    }

}