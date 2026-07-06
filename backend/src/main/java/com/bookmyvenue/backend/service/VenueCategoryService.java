package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.venueCategory.VenueCategoryRequest;
import com.bookmyvenue.backend.dto.venueCategory.VenueCategoryResponse;
import java.util.List;

public interface VenueCategoryService {

    VenueCategoryResponse createCategory(
            VenueCategoryRequest request);

    VenueCategoryResponse getCategoryById(Long id);

    List<VenueCategoryResponse> getAllCategories();

    VenueCategoryResponse updateCategory(
            Long id,
            VenueCategoryRequest request);

    void deleteCategory(Long id);

    VenueCategoryResponse getCategoryByName(String categoryName);

    List<VenueCategoryResponse> getActiveCategoriesOnly();
}
