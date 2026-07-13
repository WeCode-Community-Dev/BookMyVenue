package com.bookmyvenue.server.venue.service;

import com.bookmyvenue.server.venue.dto.response.VenueCategoryResponse;

import java.util.List;

public interface VenueCategoryService {

    List<VenueCategoryResponse> getCategories();
}