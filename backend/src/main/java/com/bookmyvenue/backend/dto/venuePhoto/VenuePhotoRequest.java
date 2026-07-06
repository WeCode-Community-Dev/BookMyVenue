package com.bookmyvenue.backend.dto.venuePhoto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VenuePhotoRequest {

    private Long venueId;
    @NotNull
    private Boolean isPrimary;

    private Integer displayOrder;

    private String photoUrl;

    private Long createdBy;

    private Long updatedBy;
}