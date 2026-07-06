package com.bookmyvenue.backend.controller;
import com.bookmyvenue.backend.dto.venueCategory.VenueCategoryRequest;
import com.bookmyvenue.backend.dto.venueCategory.VenueCategoryResponse;
import com.bookmyvenue.backend.service.VenueCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/venue-categories")
@RequiredArgsConstructor
@Tag(name = "Venue Categories", description = "APIs for managing venue categories")
public class VenueCategoryController {

    private final VenueCategoryService service;

    @PostMapping
    @Operation(summary = "Create a new venue category", description = "Creates a new venue category with provided details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = VenueCategoryResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "409", description = "Category already exists")
    })
    public ResponseEntity<VenueCategoryResponse> create(
            @Valid
            @RequestBody
            VenueCategoryRequest request) {

        return ResponseEntity.ok(
                service.createCategory(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID", description = "Retrieves a specific venue category by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = VenueCategoryResponse.class))),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<VenueCategoryResponse> getById(
            @Parameter(description = "Category ID", required = true)
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getCategoryById(id));
    }

    @GetMapping
    @Operation(summary = "Get all categories", description = "Retrieves all venue categories with efficient DTO projection")
    @ApiResponse(responseCode = "200", description = "List of all categories",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = VenueCategoryResponse.class)))
    public ResponseEntity<List<VenueCategoryResponse>> getAll() {

        return ResponseEntity.ok(
                service.getAllCategories());
    }

    @GetMapping("/by-name/{name}")
    @Operation(summary = "Get category by name", description = "Retrieves a specific venue category by its name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = VenueCategoryResponse.class))),
            @ApiResponse(responseCode = "404", description = "Category not found with provided name")
    })
    public ResponseEntity<VenueCategoryResponse> getByName(
            @Parameter(description = "Category name", required = true)
            @PathVariable String name) {

        return ResponseEntity.ok(
                service.getCategoryByName(name));
    }

    @GetMapping("/active/list")
    @Operation(summary = "Get active categories", description = "Retrieves only active venue categories")
    @ApiResponse(responseCode = "200", description = "List of active categories",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = VenueCategoryResponse.class)))
    public ResponseEntity<List<VenueCategoryResponse>> getActiveCategories() {

        return ResponseEntity.ok(
                service.getActiveCategoriesOnly());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update venue category", description = "Updates an existing venue category with new details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category updated successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = VenueCategoryResponse.class))),
            @ApiResponse(responseCode = "404", description = "Category not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<VenueCategoryResponse> update(
            @Parameter(description = "Category ID", required = true)
            @PathVariable Long id,
            @Valid
            @RequestBody
            VenueCategoryRequest request) {

        return ResponseEntity.ok(
                service.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete venue category", description = "Deletes an existing venue category by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Category deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Category ID", required = true)
            @PathVariable Long id) {

        service.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
}
