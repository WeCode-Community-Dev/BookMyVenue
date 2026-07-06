package com.bookmyvenue.backend.controller;

import com.bookmyvenue.backend.dto.eventCategory.EventCategoryRequest;
import com.bookmyvenue.backend.dto.eventCategory.EventCategoryResponse;
import com.bookmyvenue.backend.service.EventCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/event-categories")
@RequiredArgsConstructor
public class EventCategoryController {

    private final EventCategoryService service;

    @PostMapping
    public ResponseEntity<EventCategoryResponse> create(@RequestBody EventCategoryRequest request) {
        return ResponseEntity.ok(service.createCategory(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventCategoryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCategory(id));
    }

    @GetMapping
    public ResponseEntity<List<EventCategoryResponse>> getAll() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventCategoryResponse> update(@PathVariable Long id, @RequestBody EventCategoryRequest request) {
        return ResponseEntity.ok(service.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}

