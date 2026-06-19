package com.bookmyvenue.backend.mapper;
import com.bookmyvenue.backend.dto.venuePhoto.VenuePhotoRequest;
import com.bookmyvenue.backend.dto.venuePhoto.VenuePhotoResponse;
import com.bookmyvenue.backend.entity.VenuePhoto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VenuePhotoMapper {

    VenuePhoto toEntity(VenuePhotoRequest request );

    VenuePhotoResponse toResponse(VenuePhoto response);
}