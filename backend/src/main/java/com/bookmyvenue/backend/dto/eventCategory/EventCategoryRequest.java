package com.bookmyvenue.backend.dto.eventCategory;

import lombok.Data;

@Data
public class EventCategoryRequest {
    private String eventCategoryName;
    private String description;
    private Long createdBy;
}

