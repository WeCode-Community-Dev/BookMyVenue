package com.bookmyvenue.server.venue.controller;


import com.bookmyvenue.server.venue.dto.response.VenueCategoryResponse;
import com.bookmyvenue.server.venue.service.VenueCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class VenueCategoryController {

    private final VenueCategoryService venueCategoryService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<VenueCategoryResponse> getCategories() {
        return venueCategoryService.getCategories();
    }
}
