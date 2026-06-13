package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.adminDashboard.AdminRequestResponse;
import com.bookmyvenue.backend.dto.adminDashboard.AdminRequestSearchRequest;

import java.util.List;

public interface AdminRequestService {

    List<AdminRequestResponse>
    getAllRequests();

    List<AdminRequestResponse>
    searchRequests(
            AdminRequestSearchRequest request);

    AdminRequestResponse
    approveRequest(
            Long venueId,
            String remarks);

    AdminRequestResponse
    rejectRequest(
            Long venueId,
            String remarks);

    AdminRequestResponse
    getRequestDetails(
            Long venueId);
}