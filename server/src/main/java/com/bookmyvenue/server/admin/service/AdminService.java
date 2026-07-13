package com.bookmyvenue.server.admin.service;

import com.bookmyvenue.server.admin.dto.response.AdminUserResponse;
import com.bookmyvenue.server.admin.dto.response.AdminVenueResponse;
import com.bookmyvenue.server.admin.dto.response.DashboardResponse;
import com.bookmyvenue.server.venue.dto.response.VenueResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AdminService {


    DashboardResponse getDashboard();


    Page<AdminVenueResponse> getPendingVenues(int page, int size);


    void approveVenue(Long venueId);


    void rejectVenue(Long venueId);

    VenueResponse getVenue(Long venueId);


    Page<AdminVenueResponse> getAllVenues(int page, int size);


    Page<AdminUserResponse> getUsers(int page, int size);

    Page<AdminUserResponse> getVendors(int page, int size);
}
