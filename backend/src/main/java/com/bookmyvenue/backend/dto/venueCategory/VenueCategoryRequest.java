package com.bookmyvenue.backend.dto.venueCategory;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VenueCategoryRequest {

    @NotBlank(message = "Category name is required")
    private String categoryName;
    private String description;
    private Boolean isActive;
}