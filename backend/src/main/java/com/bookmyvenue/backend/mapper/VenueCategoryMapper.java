package com.bookmyvenue.backend.mapper;


import com.bookmyvenue.backend.dto.venueCategory.VenueCategoryRequest;
import com.bookmyvenue.backend.dto.venueCategory.VenueCategoryResponse;
import com.bookmyvenue.backend.entity.VenueCategory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VenueCategoryMapper {

    VenueCategory toEntity(VenueCategoryRequest request);

    VenueCategoryResponse toResponse(VenueCategory response);
}