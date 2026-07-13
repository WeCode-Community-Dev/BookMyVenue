package com.bookmyvenue.server.venue.service;

import com.bookmyvenue.server.venue.dto.response.VenueCategoryResponse;
import com.bookmyvenue.server.venue.repository.VenueCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueCategoryServiceImpl
        implements VenueCategoryService {

    private final VenueCategoryRepository venueCategoryRepository;

    @Override
    public List<VenueCategoryResponse> getCategories() {

        return venueCategoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(category ->
                        VenueCategoryResponse.builder()
                                .id(category.getId())
                                .name(category.getName())
                                .description(category.getDescription())
                                .build()
                )
                .toList();
    }
}