package com.bookmyvenue.server.venue.service;

import com.bookmyvenue.server.auth.service.AuthenticatedUserService;
import com.bookmyvenue.server.common.exception.BusinessException;
import com.bookmyvenue.server.common.exception.ErrorCode;
import com.bookmyvenue.server.user.entity.User;
import com.bookmyvenue.server.venue.dto.request.CreateVenueRequest;
import com.bookmyvenue.server.venue.dto.request.UpdateVenueRequest;
import com.bookmyvenue.server.venue.dto.response.VenueResponse;
import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.entity.VenueCategory;
import com.bookmyvenue.server.venue.entity.VenueImage;
import com.bookmyvenue.server.venue.entity.VenueStatus;
import com.bookmyvenue.server.venue.mapper.VenueMapper;
import com.bookmyvenue.server.venue.repository.VenueCategoryRepository;
import com.bookmyvenue.server.venue.repository.VenueImageRepository;
import com.bookmyvenue.server.venue.repository.VenueRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;
    private final VenueCategoryRepository venueCategoryRepository;
    private final VenueMapper venueMapper;
    private final AuthenticatedUserService authenticatedUserService;
    private final VenueImageRepository venueImageRepository;

    @Override
    public VenueResponse createVenue(CreateVenueRequest request) {
        log.info("Creating venue with name: {}, categoryId: {}",
                request.getName(),
                request.getCategoryId());
        VenueCategory category = venueCategoryRepository
                .findById(request.getCategoryId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.VENUE_CATEGORY_NOT_FOUND));

        // Get currently authenticated venue owner
        User currentUser =
                authenticatedUserService.getCurrentUser();
        System.out.println("CURRENT USER = " + currentUser.getEmail());


        // New venues require admin approval before becoming visible
        Venue venue = Venue.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .district(request.getDistrict())
                .capacity(request.getCapacity())
                .pricePerSlot(request.getPricePerSlot())
                .advancePercentage(request.getAdvancePercentage())
                .category(category)
                .status(VenueStatus.PENDING_APPROVAL)
                .owner(currentUser)
                .build();

        if (request.getImageUrls() != null) {
            request.getImageUrls().forEach(url -> {
                VenueImage image = VenueImage.builder()
                        .venue(venue)
                        .imageUrl(url)
                        .build();

                venue.getImages().add(image);
            });
        }

        Venue savedVenue = venueRepository.save(venue);

        return venueMapper.toResponse(savedVenue);
    }

    @Override
    public List<VenueResponse> getAllVenues() {
        User currentUser = authenticatedUserService.getCurrentUser();
        List<Venue> venues = venueRepository.findByOwnerId(currentUser.getId());

      return venueMapper.toResponse(venues);
    }

    @Override
    public VenueResponse getVenue(Long venueId) {
        User currentUser = authenticatedUserService.getCurrentUser();

        Venue venue = venueRepository
                .findByIdAndOwnerId(venueId, currentUser.getId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));
        return venueMapper.toResponse(venue);
    }

    @Override
    public List<VenueResponse> getApprovedVenues(
            String keyword,
            String district,
            Long categoryId
    ) {

        List<Venue> venues;

        if (keyword != null && !keyword.isBlank()) {

            venues = venueRepository.findByStatusAndNameContainingIgnoreCase(
                    VenueStatus.APPROVED,
                    keyword
            );

        } else if (district != null && categoryId != null) {

            venues = venueRepository
                    .findByStatusAndDistrictContainingIgnoreCaseAndCategoryId(
                            VenueStatus.APPROVED,
                            district,
                            categoryId
                    );

        } else if (district != null) {

            venues = venueRepository
                    .findByStatusAndDistrictContainingIgnoreCase(
                            VenueStatus.APPROVED,
                            district
                    );

        } else if (categoryId != null) {

            venues = venueRepository
                    .findByStatusAndCategoryId(
                            VenueStatus.APPROVED,
                            categoryId
                    );

        }


        else {

            venues = venueRepository.findByStatus(
                    VenueStatus.APPROVED
            );
        }

        return venues.stream()
                .map(venueMapper::toResponse)
                .toList();
    }

    @Override
    public VenueResponse getApprovedVenue(Long id) {

        Venue venue = venueRepository
                .findByIdAndStatus(id, VenueStatus.APPROVED)
                .orElseThrow(()->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));

        return venueMapper.toResponse(venue);
    }

    @Override
    public VenueResponse updateVenue(
            Long venueId,
            UpdateVenueRequest request
    ) {

        // Ensure only the venue owner can modify venue details
        User currentUser = authenticatedUserService.getCurrentUser();
        Venue venue = venueRepository
                .findByIdAndOwnerId(venueId, currentUser.getId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));

        if (request.getName() != null) {
            venue.setName(request.getName());
        }

        if (request.getDescription() != null) {
            venue.setDescription(request.getDescription());
        }

        if (request.getAddress() != null) {
            venue.setAddress(request.getAddress());
        }

        if (request.getDistrict() != null) {
            venue.setDistrict(request.getDistrict());
        }

        if (request.getCapacity() != null) {
            venue.setCapacity(request.getCapacity());
        }

        if (request.getPricePerSlot() != null) {
            venue.setPricePerSlot(request.getPricePerSlot());
        }

        if (request.getAdvancePercentage() != null) {
            venue.setAdvancePercentage(
                    request.getAdvancePercentage()
            );
        }

        if (request.getCategoryId() != null) {

            VenueCategory category = venueCategoryRepository
                    .findById(request.getCategoryId())
                    .orElseThrow(() ->
                           new BusinessException(ErrorCode.VENUE_CATEGORY_NOT_FOUND));

            venue.setCategory(category);
        }

        Venue updatedVenue = venueRepository.save(venue);

        log.info(
                "Venue updated. venueId={}, ownerId={}",
                updatedVenue.getId(),
                currentUser.getId()
        );

        return venueMapper.toResponse(updatedVenue);
    }

    @Override
    public void deleteVenue(Long venueId){

            User currentUser = authenticatedUserService.getCurrentUser();
            Venue venue = venueRepository
                .findByIdAndOwnerId(venueId, currentUser.getId())
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));
        venueRepository.delete(venue);

        log.info(
                "Venue deleted. venueId={}, ownerId={}",
                venueId,
                currentUser.getId()
        );
    }
}