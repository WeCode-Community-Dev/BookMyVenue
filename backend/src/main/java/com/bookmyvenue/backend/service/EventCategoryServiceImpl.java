package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.eventCategory.EventCategoryRequest;
import com.bookmyvenue.backend.dto.eventCategory.EventCategoryResponse;
import com.bookmyvenue.backend.entity.EventCategory;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.repository.EventCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EventCategoryServiceImpl implements EventCategoryService {

    private final EventCategoryRepository repository;

    @Override
    public EventCategoryResponse createCategory(EventCategoryRequest request) {
        EventCategory category = EventCategory.builder()
                .eventCategoryName(request.getEventCategoryName())
                .description(request.getDescription())
                .createdBy(request.getCreatedBy())
                .updatedBy(request.getCreatedBy())
                .build();

        EventCategory saved = repository.save(category);

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EventCategoryResponse getCategory(Long id) {
        EventCategory category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EventCategory not found with id: " + id));
        return toResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventCategoryResponse> getAllCategories() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EventCategoryResponse updateCategory(Long id, EventCategoryRequest request) {
        EventCategory category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EventCategory not found with id: " + id));

        category.setEventCategoryName(request.getEventCategoryName());
        category.setDescription(request.getDescription());
        category.setUpdatedBy(request.getCreatedBy());

        EventCategory updated = repository.save(category);
        return toResponse(updated);
    }

    @Override
    public void deleteCategory(Long id) {
        EventCategory category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EventCategory not found with id: " + id));
        repository.delete(category);
    }

    private EventCategoryResponse toResponse(EventCategory category) {
        EventCategoryResponse resp = new EventCategoryResponse();
        resp.setEventCategoryId(category.getEventCategoryId());
        resp.setEventCategoryName(category.getEventCategoryName());
        resp.setDescription(category.getDescription());
        return resp;
    }
}

