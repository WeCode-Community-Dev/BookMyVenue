package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.eventCategory.EventCategoryRequest;
import com.bookmyvenue.backend.dto.eventCategory.EventCategoryResponse;

import java.util.List;

public interface EventCategoryService {
    EventCategoryResponse createCategory(EventCategoryRequest request);
    EventCategoryResponse getCategory(Long id);
    List<EventCategoryResponse> getAllCategories();
    EventCategoryResponse updateCategory(Long id, EventCategoryRequest request);
    void deleteCategory(Long id);
}

