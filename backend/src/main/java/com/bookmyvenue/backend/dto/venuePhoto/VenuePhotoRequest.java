package com.bookmyvenue.backend.dto.venuePhoto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VenuePhotoRequest {

    @NotNull
    private Long venueId;

    private Boolean isPrimary;

    private Integer displayOrder;

    @NotNull
    private Long createdBy;

    private Long updatedBy;
}