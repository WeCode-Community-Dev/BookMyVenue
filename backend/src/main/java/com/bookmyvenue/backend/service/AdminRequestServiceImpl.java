package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.admin.AdminRequestResponse;
import com.bookmyvenue.backend.dto.admin.AdminRequestSearchRequest;
import com.bookmyvenue.backend.entity.Venue;
import com.bookmyvenue.backend.enums.VenueStatus;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.repository.VenueRepository;
import com.bookmyvenue.backend.service.AdminRequestService;
import com.bookmyvenue.backend.specification.AdminRequestSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminRequestServiceImpl implements AdminRequestService {

    private final VenueRepository venueRepository;

    @Override
    public List<AdminRequestResponse> getAllRequests() {

        return venueRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AdminRequestResponse getRequestDetails(Long venueId) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id : "
                                        + venueId));

        return mapToResponse(venue);
    }

    @Override
    public List<AdminRequestResponse> searchRequests(
            AdminRequestSearchRequest request) {

        Specification<Venue> specification =
                Specification.allOf(
                        AdminRequestSpecification.hasVenueName(
                                request.getVenueName()),
                        AdminRequestSpecification.hasStatus(
                                request.getStatus()),
                        AdminRequestSpecification.hasOwner(
                                request.getOwnerId())
                );

        return venueRepository.findAll(specification)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AdminRequestResponse approveRequest(
            Long venueId,
            String remarks) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id : "
                                        + venueId));

        venue.setStatus(VenueStatus.APPROVED);
        venue.setApprovalRemarks(remarks);

        Venue updatedVenue =
                venueRepository.save(venue);

        return mapToResponse(updatedVenue);
    }

    @Override
    public AdminRequestResponse rejectRequest(
            Long venueId,
            String remarks) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue not found with id : "
                                        + venueId));

        venue.setStatus(VenueStatus.REJECTED);
        venue.setApprovalRemarks(remarks);

        Venue updatedVenue =
                venueRepository.save(venue);

        return mapToResponse(updatedVenue);
    }

    private AdminRequestResponse mapToResponse(
            Venue venue) {

        return AdminRequestResponse.builder()
                .venueId(venue.getVenueId())
                .venueName(venue.getVenueName())
                .ownerId(venue.getOwnerUser().getUserId())
                .ownerName(venue.getOwnerUser().getFirstName())
                .requestType("NEW_LISTING")
                .status(venue.getStatus())
                .requestDate(venue.getCreatedAt())
                .approvalRemarks(
                        venue.getApprovalRemarks())
                .build();
    }
}