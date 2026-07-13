package com.bookmyvenue.server.venue.mapper;

import com.bookmyvenue.server.venue.dto.response.VenueResponse;
import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.entity.VenueImage;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class VenueMapper {

    public VenueResponse toResponse(Venue venue) {
        return VenueResponse.builder()
                .id(venue.getId())
                .name(venue.getName())
                .description(venue.getDescription())
                .address(venue.getAddress())
                .district(venue.getDistrict())
                .capacity(venue.getCapacity())
                .pricePerSlot(venue.getPricePerSlot())
                .advancePercentage(
                        venue.getAdvancePercentage()
                )
                .category(venue.getCategory().getName())
                .status(venue.getStatus())
                .imageUrls(
                        venue.getImages()
                                .stream()
                                .map(VenueImage::getImageUrl)
                                .toList()
                )
                .build();
    }

    public List<VenueResponse> toResponse(List<Venue> venues) {
        return venues.stream()
                .map(this::toResponse)
                .toList();
    }
}