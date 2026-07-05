package com.bookmyvenue.backend.mapper;

import com.bookmyvenue.backend.dto.Venue.VenueCreationRequest;
import com.bookmyvenue.backend.dto.Venue.VenueCreationResponse;
import com.bookmyvenue.backend.entity.Amenity;
import com.bookmyvenue.backend.entity.EventCategory;
import com.bookmyvenue.backend.entity.Venue;
import com.bookmyvenue.backend.entity.VenuePhoto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@Mapper(componentModel = "spring")
public interface VenueMapper {

    @Mapping(target = "venueId", ignore = true)
    @Mapping(target = "ownerUser", ignore = true)
    @Mapping(target = "supportedEventCategories", ignore = true)
    @Mapping(target = "amenities", ignore = true)
    @Mapping(target = "venuePhotos", ignore = true)
    @Mapping(target = "availabilities", ignore = true)
    @Mapping(target = "bookings", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "approvalRemarks", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Venue toEntity(VenueCreationRequest request);

    @Mapping(source = "venueId", target = "venueId")
    @Mapping(source = "ownerUser.userId", target = "ownerUserId")
    @Mapping(source = "venueName", target = "venueName")
    @Mapping(source = "addressLine1", target = "addressLine1")
    @Mapping(source = "addressLine2", target = "addressLine2")
    @Mapping(source = "city", target = "city")
    @Mapping(source = "district", target = "district")
    @Mapping(source = "state", target = "state")
    @Mapping(source = "country", target = "country")
    @Mapping(source = "pincode", target = "pincode")
    @Mapping(source = "latitude", target = "latitude")
    @Mapping(source = "longitude", target = "longitude")
    @Mapping(source = "capacity", target = "capacity")
    @Mapping(source = "pricingType", target = "pricingType")
    @Mapping(source = "basePrice", target = "basePrice")
    @Mapping(source = "advancePercentage", target = "advancePercentage")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "approvalRemarks", target = "approvalRemarks")
    @Mapping(source = "contactName", target = "contactName")
    @Mapping(source = "contactEmail", target = "contactEmail")
    @Mapping(source = "supportedEventCategories", target = "supportedEventCategories")
    @Mapping(source = "amenities", target = "amenities")
    @Mapping(source = "venuePhotos", target = "photoUrls")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "updatedAt", target = "updatedAt")
    @Mapping(source = "createdBy", target = "createdBy")
    @Mapping(source = "updatedBy", target = "updatedBy")
    VenueCreationResponse toResponse(Venue venue);

    default Set<String> mapAmenities(Set<Amenity> amenities) {
        if (amenities == null) {
            return null;
        }

        return amenities.stream()
                .map(Amenity::getAmenityName)
                .collect(Collectors.toSet());
    }

    default Set<String> mapSupportedEventCategories(Set<EventCategory> categories) {
        if (categories == null) {
            return null;
        }

        return categories.stream()
                .map(EventCategory::getEventCategoryName)
                .collect(Collectors.toSet());
    }

    default List<String> mapVenuePhotos(List<VenuePhoto> photos) {
        if (photos == null) {
            return null;
        }

        return photos.stream()
                .map(VenuePhoto::getPhotoUrl)
                .collect(Collectors.toList());
    }
}