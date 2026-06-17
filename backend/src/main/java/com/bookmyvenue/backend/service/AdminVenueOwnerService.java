package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.admin.AdminVenueOwnerResponse;
import com.bookmyvenue.backend.dto.admin.AdminVenueOwnerSearchRequest;

import java.util.List;

public interface AdminVenueOwnerService {

    List<AdminVenueOwnerResponse>
    getAllVenueOwners();

    AdminVenueOwnerResponse
    getVenueOwnerById(Long ownerId);

    List<AdminVenueOwnerResponse>
    searchVenueOwners(
            AdminVenueOwnerSearchRequest request);

    AdminVenueOwnerResponse
    verifyVenueOwner(Long ownerId);

    AdminVenueOwnerResponse
    suspendVenueOwner(Long ownerId);
}