package com.bookmyvenue.backend.dto.eventCategory;

import lombok.Data;

@Data
public class EventCategoryResponse {
    private Long eventCategoryId;
    private String eventCategoryName;
    private String description;
}

