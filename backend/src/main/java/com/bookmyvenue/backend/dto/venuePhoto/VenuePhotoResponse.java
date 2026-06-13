package com.bookmyvenue.backend.dto.venuePhoto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class VenuePhotoResponse {

    private Long photoId;

    private Long venueId;

    private Boolean isPrimary;

    private Integer displayOrder;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long createdBy;

    private Long updatedBy;
}