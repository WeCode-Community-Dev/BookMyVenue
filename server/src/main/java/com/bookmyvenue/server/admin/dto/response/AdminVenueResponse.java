package com.bookmyvenue.server.admin.dto.response;

import com.bookmyvenue.server.venue.entity.VenueStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminVenueResponse {

    private Long id;
    private String name;
    private String district;
    private String address;
    private Integer capacity;
    private String ownerName;
    private String ownerEmail;
    private VenueStatus status;
}