package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.venueCategory.VenueCategoryRequest;
import com.bookmyvenue.backend.dto.venueCategory.VenueCategoryResponse;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.entity.VenueCategory;
import com.bookmyvenue.backend.mapper.VenueCategoryMapper;
import com.bookmyvenue.backend.repository.VenueCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueCategoryServiceImpl implements VenueCategoryService {

    private final VenueCategoryRepository repository;
    private final VenueCategoryMapper mapper;

    @Override
    public VenueCategoryResponse createCategory(VenueCategoryRequest request) {
        validateCategoryRequest(request);
        checkDuplicateCategoryName(request.getCategoryName());
        VenueCategory entity = mapper.toEntity(request);
        entity.setCreatedBy(1L);
        entity.setUpdatedBy(1L);
        VenueCategory saved = repository.save(entity);
        return mapper.toResponse(saved);
    }

    @Override
    public VenueCategoryResponse getCategoryById(Long id) {
        validateId(id);
        return repository.findByIdVenuCategoryDto(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Override
    public List<VenueCategoryResponse> getAllCategories() {
        return repository.findAllVenuCategoriesDto();
    }

    @Override
    public VenueCategoryResponse updateCategory(Long id, VenueCategoryRequest request) {
        validateId(id);
        validateCategoryRequest(request);
        
        VenueCategory existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        VenueCategory updatedEntity = VenueCategory.builder()
                .categoryId(existing.getCategoryId())
                .categoryName(request.getCategoryName())
                .description(request.getDescription())
                .isActive(request.getIsActive())
                .createdAt(existing.getCreatedAt())
                .createdBy(existing.getCreatedBy())
                .updatedAt(java.time.LocalDateTime.now())
                .updatedBy(1L)
                .build();

        VenueCategory saved = repository.save(updatedEntity);
        return mapper.toResponse(saved);
    }

    @Override
    public void deleteCategory(Long id) {
        validateId(id);
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        repository.deleteById(id);
    }

    public List<VenueCategoryResponse> getActiveCategoriesOnly() {
        return repository.findAllActiveVenuCategoriesDto();
    }

    public VenueCategoryResponse getCategoryByName(String categoryName) {
        return repository.findByCategoryName(categoryName)
                .map(mapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with name: " + categoryName));
    }

    private void validateCategoryRequest(VenueCategoryRequest request) {
        if (request.getCategoryName() == null || request.getCategoryName().isBlank()) {
            throw new IllegalArgumentException("Category name cannot be empty");
        }
        if (request.getCategoryName().length() > 255) {
            throw new IllegalArgumentException("Category name cannot exceed 255 characters");
        }
    }

    private void validateId(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid category id");
        }
    }

    private void checkDuplicateCategoryName(String categoryName) {
        repository.findByCategoryName(categoryName).ifPresent(entity -> {
            throw new IllegalArgumentException("Category with name '" + categoryName + "' already exists");
        });
    }
}