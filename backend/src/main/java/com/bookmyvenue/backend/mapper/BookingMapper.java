package com.bookmyvenue.backend.mapper;

import com.bookmyvenue.backend.dto.Book.BookingRequest;
import com.bookmyvenue.backend.dto.Book.BookingResponse;
import com.bookmyvenue.backend.dto.venueAmenity.AmenityRequest;
import com.bookmyvenue.backend.dto.venueAmenity.AmenityResponse;
import com.bookmyvenue.backend.entity.Amenity;
import com.bookmyvenue.backend.entity.Booking;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    Booking toEntity(BookingRequest request );

    BookingResponse toResponse(Booking booking);
}