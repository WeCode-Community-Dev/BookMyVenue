package com.bookmyvenue.backend.service;

import com.bookmyvenue.backend.dto.admin.AdminVenueOwnerResponse;
import com.bookmyvenue.backend.dto.admin.AdminVenueOwnerSearchRequest;
import com.bookmyvenue.backend.entity.Users;
import com.bookmyvenue.backend.enums.UserStatus;
import com.bookmyvenue.backend.exception.ResourceNotFoundException;
import com.bookmyvenue.backend.repository.PaymentRepository;
import com.bookmyvenue.backend.repository.UserRepository;
import com.bookmyvenue.backend.repository.VenueRepository;
import com.bookmyvenue.backend.specification.VenueOwnerSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminVenueOwnerServiceImpl
        implements AdminVenueOwnerService {

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public List<AdminVenueOwnerResponse>
    getAllVenueOwners() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AdminVenueOwnerResponse
    getVenueOwnerById(Long ownerId) {

        Users owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue owner not found"));

        return mapToResponse(owner);
    }


    @Override
    public List<AdminVenueOwnerResponse>
    searchVenueOwners(
            AdminVenueOwnerSearchRequest request) {

        Specification<Users> spec =
                Specification.allOf(
                        VenueOwnerSpecification.hasName(
                                request.getName()),
                        VenueOwnerSpecification.hasEmail(
                                request.getEmail()),
                        VenueOwnerSpecification.hasStatus(
                                request.getStatus())
                );

        return userRepository.findAll(spec)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AdminVenueOwnerResponse
    verifyVenueOwner(Long ownerId) {

        Users owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue owner not found"));

        owner.setStatus(UserStatus.ACTIVE);

        return mapToResponse(
                userRepository.save(owner));
    }

    @Override
    public AdminVenueOwnerResponse
    suspendVenueOwner(Long ownerId) {

        Users owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Venue owner not found"));

        owner.setStatus(UserStatus.SUSPENDED);

        return mapToResponse(
                userRepository.save(owner));
    }

    private AdminVenueOwnerResponse
    mapToResponse(Users owner) {

        Long totalVenues =
                venueRepository.countByOwnerUserUserId(
                        owner.getUserId());

        java.math.BigDecimal revenue =
                paymentRepository
                        .getRevenueByOwnerId(
                                owner.getUserId());

        return AdminVenueOwnerResponse.builder()
                .ownerId(owner.getUserId())
                .ownerName(owner.getFirstName())
                .email(owner.getEmail())
                .totalVenues(totalVenues)
                .revenue(revenue)
                .status(owner.getStatus())
                .build();
    }
}