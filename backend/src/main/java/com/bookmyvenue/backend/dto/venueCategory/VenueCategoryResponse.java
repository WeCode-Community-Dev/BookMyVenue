package com.bookmyvenue.backend.dto.venueCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class VenueCategoryResponse {

    private Long categoryId;
    private String categoryName;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public VenueCategoryResponse() {

    }
}
