package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.venueOwnerDashboard.OwnerDashboardResponse;

public interface OwnerDashboardService {

    OwnerDashboardResponse
    getDashboard(Long ownerId);
}
