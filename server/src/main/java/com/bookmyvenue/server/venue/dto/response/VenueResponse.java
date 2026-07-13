package com.bookmyvenue.server.venue.dto.response;

import com.bookmyvenue.server.venue.entity.VenueStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VenueResponse {

    private Long id;

    private String name;

    private String description;

    private String address;

    private String district;

    private Integer capacity;

    private BigDecimal pricePerSlot;

    private BigDecimal advancePercentage;

    private String category;

    private VenueStatus status;

    private List<String> imageUrls;
}
